"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

/**
 * Root providers: wagmi + react-query + toast notifications.
 * Wrapped in a client component because wagmi uses browser-only APIs.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10_000,
            retry: 2,
          },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#D1D5DB",
              border: "1px solid #374151",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#19D184",
                secondary: "#111827",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#111827",
              },
            },
          }}
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
