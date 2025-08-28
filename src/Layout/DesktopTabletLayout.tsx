import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App.tsx";
import Music from "../pages/Music.tsx";
import Account from "../pages/Account.tsx";
import StartCreating from "../pages/StartCreating.tsx";
import { MusicTracks } from "../pages/MusicTracks.tsx";
// import TestIframe from "../pages/TestIframe.tsx";
// TestIframe can work also with youTube, I could try later to make this option

export const DesktopTabletLayout = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<App />}
          children={
            <>
              <Route index element={<Music />} />
              <Route path="search/tracks" element={<MusicTracks />} />
              <Route path="account" element={<Account />} />
              <Route path="create" element={<StartCreating />} />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
