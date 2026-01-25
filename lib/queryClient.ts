"use client"

import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Retry on 502/503/504 errors
        if (error instanceof Error && "status" in error) {
          const status = (error as { status: number }).status
          if ([502, 503, 504].includes(status)) {
            return failureCount < 3
          }
        }
        return failureCount < 1
      },
    },
  },
})
