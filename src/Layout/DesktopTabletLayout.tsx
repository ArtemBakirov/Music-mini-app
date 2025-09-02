import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App.tsx";
import Music from "../pages/Music.tsx";
import Account from "../pages/Account.tsx";
import StartCreating from "../pages/StartCreating.tsx";
import { MusicTracks } from "../pages/MusicTracks.tsx";
import MusicAlbums from "../pages/MusicAlbums.tsx";
import MusicArtists from "../pages/MusicArtists.tsx";
import MusicPlaylists from "../pages/MusicPlaylists.tsx";
import AlbumDetailsPage from "../pages/details/AlbumDetailsPage.tsx";
import PlaylistDetailsPage from "../pages/details/PlayListDetailsPage.tsx";
import TestIframe from "../pages/TestIframe.tsx";

export const DesktopTabletLayout = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<App />}
          children={
            <>
              <Route index element={<TestIframe />} />
              <Route path="search/tracks/:query" element={<MusicTracks />} />
              <Route path="search/albums/:query" element={<MusicAlbums />} />
              <Route path="search/artists/:query" element={<MusicArtists />} />
              <Route
                path="search/playlists/:query"
                element={<MusicPlaylists />}
              />
              <Route path="album/:albumId" element={<AlbumDetailsPage />} />
              <Route
                path="playlist/:playlistId"
                element={<PlaylistDetailsPage />}
              />
              <Route path="account" element={<Account />} />
              <Route path="create" element={<StartCreating />} />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
