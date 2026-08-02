import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

/** Every top-level destination reachable from the navbar/footer. */
const ROUTES = [
  "/",
  "/services",
  "/portfolio",
  "/about",
  "/blog",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
] as const;

/** Same-origin, in-app href → router path (or null when not prefetchable). */
function toInternalPath(anchor: HTMLAnchorElement): string | null {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || anchor.target === "_blank") return null;
  if (anchor.hasAttribute("download")) return null;
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname.startsWith("/sterova-admin")) return null;
    return url.pathname + url.search;
  } catch {
    return null;
  }
}

/**
 * Warms every route chunk once the browser is idle after first paint. With the
 * code already in memory, clicking a nav link renders the destination on the
 * same frame — no suspense fallback, no perceptible delay.
 *
 * On top of the idle sweep, links are warmed the moment the user signals
 * intent — pointer hover, keyboard focus — or when they scroll into view, so
 * deep links rendered inside page content are just as instant as the navbar.
 */
export default function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const warm = async () => {
      for (const to of ROUTES) {
        if (cancelled) return;
        try {
          await router.preloadRoute({ to });
        } catch {
          /* preloading is best-effort */
        }
      }
    };

    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(warm, { timeout: 2000 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }

    const timer = window.setTimeout(warm, 800);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const warmed = new Set<string>();
    const preload = (to: string | null) => {
      if (!to || warmed.has(to)) return;
      warmed.add(to);
      void router.preloadRoute({ to }).catch(() => {
        warmed.delete(to);
      });
    };

    const fromEvent = (event: Event) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (anchor) preload(toInternalPath(anchor));
    };

    document.addEventListener("pointerover", fromEvent, true);
    document.addEventListener("pointerdown", fromEvent, true);
    document.addEventListener("focusin", fromEvent, true);
    document.addEventListener("touchstart", fromEvent, { capture: true, passive: true });

    // Viewport-based warming: any link scrolled into view gets its chunk.
    let observer: IntersectionObserver | undefined;
    let mutation: MutationObserver | undefined;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            preload(toInternalPath(entry.target as HTMLAnchorElement));
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "200px" },
      );

      const observeAll = () => {
        document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((a) => {
          if (toInternalPath(a)) observer?.observe(a);
        });
      };

      observeAll();
      mutation = new MutationObserver(observeAll);
      mutation.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      document.removeEventListener("pointerover", fromEvent, true);
      document.removeEventListener("pointerdown", fromEvent, true);
      document.removeEventListener("focusin", fromEvent, true);
      document.removeEventListener("touchstart", fromEvent, true);
      observer?.disconnect();
      mutation?.disconnect();
    };
  }, [router]);

  return null;
}
