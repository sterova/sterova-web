import * as React from "react";
import { useRouter } from "@tanstack/react-router";

/**
 * Returns a click handler that cancels any *in-flight* navigation before a new
 * one starts.
 *
 * Without this, rapid consecutive navbar clicks queue up: the router keeps
 * resolving the first destination's loaders, and its late resolution can win
 * over the click the user actually made last. Cancelling the pending matches
 * first aborts those loaders (their `abortController.signal` fires) so only the
 * newest destination is ever resolved and rendered.
 */
export function useCancelStaleNavigation() {
  const router = useRouter();

  return React.useCallback(
    (nextPath?: string) => {
      const state = router.state;
      if (state.status !== "pending") return;
      // Same destination re-clicked: let the in-flight navigation finish.
      if (nextPath && state.location.pathname === nextPath) return;
      router.cancelMatches();
    },
    [router],
  );
}
