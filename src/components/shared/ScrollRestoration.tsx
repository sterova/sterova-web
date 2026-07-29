import { useEffect } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";

/**
 * Deterministic scroll restoration.
 *
 * The router's built-in restoration races the route-level <Suspense> boundary:
 * on back/forward the destination can remount before its content exists, so the
 * browser clamps the restore to a still-short document and the page lands at
 * the top. This owns the behaviour instead:
 *
 * - the outgoing offset is captured on every navigation (and on pagehide), so
 *   it never depends on a scroll event having fired;
 * - back/forward re-applies the stored offset, retrying across frames and
 *   reacting to layout growth so it lands the moment content exists;
 * - a forward navigation always starts at the top, and hash links keep their
 *   anchor behaviour;
 * - every scroll is instant, never animated, so nothing janks.
 *
 * All state lives at module scope: the component tree can remount during a
 * navigation, and remounting must not lose the stored state.positions.
 */
const STORAGE_KEY = "sterova:scroll-state.positions";
// How long to keep re-applying while the destination (lazy chunk, images,
// fonts) finishes laying out.
const RESTORE_BUDGET_MS = 1200;
// Any of these means the user took over — stop re-asserting immediately.
const USER_INTENT_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

type ScrollState = {
  positions: Record<string, number>;
  currentKey: string | null;
  isPop: boolean;
  initialized: boolean;
  frame: number | null;
  lastScrollY: number;
  /** True from the moment a navigation starts until the destination settles. */
  navigating: boolean;
  persistFrame: number | null;
};

// Bundling can hand different chunks their own copy of this module, and the
// tree remounts across navigations — so the state lives on one shared object.
const state: ScrollState = ((globalThis as Record<string, unknown>).__sterovaScroll ??= {
  positions: {},
  currentKey: null,
  isPop: false,
  initialized: false,
  frame: null,
  lastScrollY: 0,
  navigating: false,
  persistFrame: null,
}) as ScrollState;

function urlKey() {
  return window.location.pathname + window.location.search;
}

function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.positions));
  } catch {
    /* private mode / quota — restoration degrades to top-of-page */
  }
}

/** Coalesce sessionStorage writes to one per frame. */
function persistSoon() {
  if (state.persistFrame !== null) return;
  state.persistFrame = requestAnimationFrame(() => {
    state.persistFrame = null;
    persist();
  });
}

function remember(key: string | null) {
  if (!key) return;
  state.positions[key] = state.lastScrollY;
  persist();
}

function init() {
  if (state.initialized || typeof window === "undefined") return;
  state.initialized = true;

  // Take over from the browser so it never fights our restore.
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  try {
    state.positions = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}") || {};
  } catch {
    state.positions = {};
  }
  state.currentKey = urlKey();
  state.lastScrollY = window.scrollY;

  // Cross-document back/forward (hard reload, bfcache miss): the router never
  // sees a navigation, so re-apply the stored offset for this URL ourselves.
  const navEntry = performance.getEntriesByType("navigation")[0] as
    PerformanceNavigationTiming | undefined;
  if (navEntry?.type === "back_forward") {
    const stored = state.positions[state.currentKey];
    if (stored && stored > 0) {
      state.navigating = true;
      restore(stored);
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      // Once a navigation is in flight, the scroll belongs to the incoming
      // page (or to our own restore) — it must not overwrite the outgoing
      // entry's saved offset.
      if (state.navigating) return;
      state.lastScrollY = window.scrollY;
      if (state.currentKey) {
        state.positions[state.currentKey] = state.lastScrollY;
        persistSoon();
      }
    },
    { passive: true },
  );

  window.addEventListener("pagehide", () => remember(state.currentKey));
}

function restore(target: number) {
  if (state.frame !== null) cancelAnimationFrame(state.frame);

  const deadline = performance.now() + RESTORE_BUDGET_MS;
  let done = false;
  let observer: ResizeObserver | undefined;

  const scrollNow = () => {
    window.scrollTo({ top: target, left: 0, behavior: "instant" as ScrollBehavior });
    state.lastScrollY = window.scrollY;
  };

  // The destination mounts in stages (skeleton -> content -> images), and each
  // stage can knock the offset back to 0. Hold the guard for the whole budget,
  // re-asserting the target, and release it the moment the user scrolls.
  const finish = () => {
    if (done) return;
    done = true;
    if (state.frame !== null) cancelAnimationFrame(state.frame);
    state.frame = null;
    observer?.disconnect();
    window.removeEventListener("scroll", onScroll);
    for (const evt of USER_INTENT_EVENTS) {
      window.removeEventListener(evt, onUserIntent);
    }
    state.lastScrollY = window.scrollY;
    state.navigating = false;
  };

  const onUserIntent = () => finish();

  const onScroll = () => {
    // Something other than the user (layout shift, remount) moved us: put it back.
    if (!done && Math.abs(window.scrollY - target) > 2) scrollNow();
  };

  const tick = () => {
    if (done) return;
    if (Math.abs(window.scrollY - target) > 2) scrollNow();
    if (performance.now() >= deadline) {
      finish();
      return;
    }
    state.frame = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  for (const evt of USER_INTENT_EVENTS) {
    window.addEventListener(evt, onUserIntent, { passive: true });
  }

  if (typeof ResizeObserver !== "undefined") {
    // Re-apply the instant the document grows, so the offset lands on the same
    // frame the real content appears instead of after a visible settle.
    observer = new ResizeObserver(() => {
      if (!done && Math.abs(window.scrollY - target) > 2) scrollNow();
    });
    observer.observe(document.documentElement);
  }

  scrollNow();
  state.frame = requestAnimationFrame(tick);

  return finish;
}

export default function ScrollRestoration() {
  const router = useRouter();
  // Key off the router's location, not window.location: during a client
  // navigation the router state updates first, so reading window.location here
  // can still report the previous URL and skip the restore entirely.
  const routeKey = useRouterState({
    select: (s) => s.location.pathname + (s.location.searchStr ?? ""),
  });
  const hash = useRouterState({ select: (s) => s.location.hash });

  // Freeze the outgoing offset the instant a navigation begins. Doing this in
  // the effect is too late: the destination can mount (and reset the document
  // height / scroll to 0) before the effect runs, so the saved value would be 0.
  useEffect(() => {
    init();
    const unsub = router.subscribe("onBeforeNavigate", () => {
      try {
        sessionStorage.removeItem("sterova:retry-scroll");
      } catch {
        /* storage unavailable */
      }
      remember(state.currentKey);
      state.navigating = true;
    });
    // history.subscribe fires as the entry changes, before the router state
    // update reaches React — unlike a window "popstate" listener, which the
    // router's own handler can beat, leaving us unable to tell push from pop.
    const unsubHistory = router.history.subscribe((update: { action?: { type?: string } }) => {
      const action = update.action;
      const type = String((action as { type?: string })?.type ?? "").toUpperCase();
      state.isPop = type === "POP" || type === "BACK" || type === "FORWARD";
      state.navigating = true;
    });
    return () => {
      unsub();
      unsubHistory();
    };
  }, [router]);

  // A chunk-load retry does a hard reload; restore where the user was.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem("sterova:retry-scroll");
      sessionStorage.removeItem("sterova:retry-scroll");
    } catch {
      /* storage unavailable */
    }
    if (!saved) return;
    const top = Number(saved);
    if (!Number.isFinite(top) || top <= 0) return;
    const start = performance.now();
    const tick = () => {
      if (Math.abs(window.scrollY - top) > 1) window.scrollTo(0, top);
      if (performance.now() - start < 1000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    init();

    const nextKey = routeKey;
    if (nextKey === state.currentKey && !state.isPop) {
      // Same URL (hash change, search-less replace): leave the page where it is.
      state.navigating = false;
      return;
    }

    const pop = state.isPop;
    state.isPop = false;

    if (!pop) remember(state.currentKey);
    state.currentKey = nextKey;
    state.lastScrollY = 0;

    // Hash navigation: the anchor target owns the scroll position.
    if (!pop && hash) {
      state.navigating = false;
      return;
    }

    const target = pop ? (state.positions[nextKey] ?? 0) : 0;
    const cleanup = restore(target);
    return () => {
      state.navigating = false;
      cleanup();
    };
  }, [routeKey, hash]);

  return null;
}
