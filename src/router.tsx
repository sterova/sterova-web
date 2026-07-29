import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import NotFoundPage from "@/pages/NotFoundPage";
import RouteErrorState from "@/components/shared/RouteErrorState";
export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Scroll position is owned by <ScrollRestoration /> (src/components/shared):
    // the built-in restore races the route <Suspense> boundary and can clamp to
    // a not-yet-rendered (short) document on back/forward.
    scrollRestoration: false,
    // Prefetch the route chunk + data on hover/focus so a click navigates
    // instantly instead of waiting for the chunk to download.
    defaultPreload: "intent",
    defaultPreloadDelay: 0,
    // Render the destination as soon as it is ready. Loaders resolve against
    // prewarmed chunks, so we never flash a whole-page pending state; the top
    // progress bar carries the feedback instead.
    defaultPendingMs: 1500,
    defaultPendingMinMs: 0,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => <NotFoundPage />,
    defaultErrorComponent: ({ error, reset }) => (
      <RouteErrorState error={error} reset={reset} boundary="router_default" />
    ),
  });

  return router;
};
