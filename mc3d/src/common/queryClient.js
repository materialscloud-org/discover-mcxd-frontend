import { QueryClient } from "@tanstack/react-query";

// One client per app (kept local so the subapps stay splittable).
// Materials data is static: cache forever within a session, never
// refetch on focus, retry once on failure.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
