import { useEffect, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";

/**
 * Thin top-of-viewport progress bar shown while the router resolves a
 * navigation (lazy route chunk + loaders). Keeps navigation feeling instant:
 * feedback starts on the click, and it always reflects the *latest* pending
 * navigation, so rapid consecutive clicks never look stuck.
 */
export default function RouteProgress() {
  const router = useRouter();
  const routerPending = useRouterState({
    select: (s) => s.status === "pending" || s.isLoading || s.isTransitioning,
  });

  // Router state alone misses the instant between the click and the first
  // pending commit, and it can stay true after a loader rejects. Drive the bar
  // from navigation *events* so every path — success, redirect, error — has an
  // explicit start and an explicit stop.
  const [navigating, setNavigating] = useState(false);
  useEffect(() => {
    const start = () => setNavigating(true);
    const stop = () => setNavigating(false);
    const unsubscribers = [
      router.subscribe("onBeforeNavigate", start),
      router.subscribe("onBeforeLoad", start),
      // onResolved fires for completed navigations; a redirect emits a fresh
      // onBeforeNavigate which re-starts the bar. onBeforeRouteMount and
      // onRendered cover the error/notFound paths where onResolved never runs.
      router.subscribe("onBeforeRouteMount", stop),
      router.subscribe("onResolved", stop),
      router.subscribe("onRendered", stop),
    ];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [router]);

  const pending = navigating || routerPending;

  // The router is always "pending" during SSR, so gate on mount to keep the
  // server and first client render identical.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Failsafe: if a navigation never emits a terminal event (rejected loader
  // promise that never settles, dead chunk), the bar must never stay stuck on.
  const [stalled, setStalled] = useState(false);
  useEffect(() => {
    if (!pending) {
      setStalled(false);
      return;
    }
    const timer = window.setTimeout(() => setStalled(true), 8_000);
    return () => window.clearTimeout(timer);
  }, [pending]);

  const isLoading = mounted && pending && !stalled;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-0.5 overflow-hidden"
    >
      <div
        className={
          "gradient-brand h-full origin-left transition-[transform,opacity] ease-out " +
          (isLoading ? "scale-x-100 opacity-100 duration-700" : "scale-x-0 opacity-0 duration-200")
        }
      />
    </div>
  );
}
