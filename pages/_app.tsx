import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { OverlayProvider } from "@/hooks/useOverlay";
import { PortalProvider } from "@/components/Portal";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
      <QueryClientProvider client={queryClient}>
        <PortalProvider>
          <OverlayProvider>
            <Component {...pageProps} />
          </OverlayProvider>
        </PortalProvider>
      </QueryClientProvider>
  );
}
