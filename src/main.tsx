import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Music from "./pages/Music.tsx";
import Account from "./pages/Account.tsx";
import { App } from "./Layout/App.tsx";

import "./utils/i18n.ts";

// query clinet
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BastyonSDKProvider } from "./Layout/Providers/BastyonSDKProvider.tsx";
import { DesktopMobileProvider } from "./Layout/Providers/DesktopMobileProvider.tsx";

// import { TestIframe } from "./pages/TestIframe.tsx";

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
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BastyonSDKProvider>
        {/*<BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<App />}
              children={
                <>
                  <Route index element={<Music />} />
                  <Route path="account" element={<Account />} />
                </>
              }
            />
          </Routes>
        </BrowserRouter> */}
        <DesktopMobileProvider />
      </BastyonSDKProvider>
    </QueryClientProvider>
  </StrictMode>,
);
