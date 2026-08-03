import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import NotFoundPage from "@/pages/NotFoundPage";
import RouteErrorState from "@/components/shared/RouteErrorState";
export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 5 minutes to prevent unnecessary Supabase queries
        staleTime: 1000 * 60 * 5,
        // Keep data in cache for 30 minutes
        gcTime: 1000 * 60 * 30,
        // Don't refetch on window focus to save bandwidth on the free tier
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

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
    defaultPreloadDelay: 50,
    // Aggressively cache router loaders to save Supabase requests
    defaultStaleTime: 1000 * 60 * 5,
    defaultPreloadStaleTime: 1000 * 60 * 5,
    defaultNotFoundComponent: () => <NotFoundPage />,
    defaultErrorComponent: ({ error, reset }) => (
      <RouteErrorState error={error} reset={reset} boundary="router_default" />
    ),
  });

  return router;
};
