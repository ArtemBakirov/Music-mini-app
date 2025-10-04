// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "./utils/i18n.ts";

// query clinet
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BastyonSDKProvider } from "./Layout/Providers/BastyonSDKProvider.tsx";
import { DesktopMobileProvider } from "./Layout/Providers/DesktopMobileProvider.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BastyonSDKProvider>
      <DesktopMobileProvider />
    </BastyonSDKProvider>
  </QueryClientProvider>,
);
