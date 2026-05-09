"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { is401, isClient4xx } from "@/lib/fetch/error-utils";

const RETRY_LIMIT = 3;
const STALE_TIME_MS = 10_000;

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (is401(error) || isClient4xx(error)) {
                return false;
              }
              return failureCount < RETRY_LIMIT;
            },
            staleTime: STALE_TIME_MS,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
