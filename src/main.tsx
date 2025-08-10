import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Music from "./pages/Music.tsx";
import { PlayLists } from "./pages/PlayLists.tsx";
import { PlaylistDetail } from "./pages/Playlistdetail.tsx";
import { Layout } from "./Layout/Layout.tsx";

import "./utils/i18n.ts";

// query clinet
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Layout />}
            children={
              <>
                <Route index element={<Music />} />
                <Route path="playlists" element={<PlayLists />} />
                <Route
                  path="playlists/:playlistId"
                  element={<PlaylistDetail />}
                />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
