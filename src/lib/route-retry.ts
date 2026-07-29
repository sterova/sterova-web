import { useCallback, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";

/** Re-assert a scroll offset across the reflows caused by a loader re-run. */
function holdScroll(top: number, durationMs = 900) {
  if (typeof window === "undefined") return;
  let cancelled = false;
  const yield_ = () => {
    cancelled = true;
  };
  const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  events.forEach((e) => window.addEventListener(e, yield_, { passive: true, once: true }));

  const start = performance.now();
  const tick = () => {
    if (cancelled) return cleanup();
    if (Math.abs(window.scrollY - top) > 1) window.scrollTo(0, top);
    if (performance.now() - start < durationMs) requestAnimationFrame(tick);
    else cleanup();
  };
  const cleanup = () => {
    events.forEach((e) => window.removeEventListener(e, yield_));
  };
  requestAnimationFrame(tick);
}

/**
 * Per-route retry: re-runs the failed route loader(s) and keeps the user
 * anchored at their current scroll position while the route re-renders.
 */
export function useRouteRetry(reset?: () => void) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);
  const inFlight = useRef(false);

  const retry = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setRetrying(true);

    const top = typeof window === "undefined" ? 0 : window.scrollY;
    holdScroll(top);

    try {
      // Clear the boundary first so the route can re-render on fresh data.
      reset?.();
      await router.invalidate();
    } catch (err) {
      console.error("Route retry failed:", err);
    } finally {
      holdScroll(top, 400);
      inFlight.current = false;
      setRetrying(false);
    }
  }, [reset, router]);

  return { retry, retrying };
}
