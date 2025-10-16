import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App.tsx";
import Account from "../pages/Account.tsx";
import StartCreating from "../pages/StartCreating.tsx";
import { MusicTracks } from "../pages/MusicTracks.tsx";
import MusicAlbums from "../pages/MusicAlbums.tsx";
import MusicArtists from "../pages/MusicArtists.tsx";
import MusicPlaylists from "../pages/MusicPlaylists.tsx";
import AlbumDetailsPage from "../pages/details/AlbumDetailsPage.tsx";
import PlaylistDetailsPage from "../pages/details/PlayListDetailsPage.tsx";
import { MusicPageContainer } from "../pages/MusicPageContainer.tsx";
import YouTubeMusicTracks from "../pages/YoutubePages/YouTubeMusicTracks.tsx";
import YouTubeMusicArtists from "../pages/YoutubePages/YouTubeMusicArtists.tsx";
import YouTubeArtistTracks from "../pages/YoutubePages/YouTubeArtistTracks.tsx";
import { CreateUploadPlaceholder } from "../pages/CreateUploadPlaceholder.tsx";

export const DesktopTabletLayout = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<App />}
          children={
            <>
              {/* Music search */}
              <Route index element={<MusicPageContainer />} />
              <Route path="search/tracks/:query" element={<MusicTracks />} />
              <Route path="search/albums/:query" element={<MusicAlbums />} />
              <Route path="search/artists/:query" element={<MusicArtists />} />
              <Route
                path="search/playlists/:query"
                element={<MusicPlaylists />}
              />
              {/* Music youTube search */}
              <Route
                path="ytsearch/tracks/:query"
                element={<YouTubeMusicTracks />}
              />
              <Route
                path="ytsearch/artists/:query"
                element={<YouTubeMusicArtists />}
              />
              <Route
                path="ytsearch/album/:albumId"
                element={<AlbumDetailsPage />}
              />
              <Route
                path="ytsearch/artist/tracks/:channelId"
                element={<YouTubeArtistTracks />}
              />

              {/*<Route
                path="ytsearch/albums/:query"
                element={<YouTubeMusicAlbums />}
              />

              <Route
                path="ytsearch/playlists/:query"
                element={<YouTubeMusicPlaylists />}
              /> */}

              <Route path="album/:albumId" element={<AlbumDetailsPage />} />
              <Route
                path="playlist/:playlistId"
                element={<PlaylistDetailsPage />}
              />
              <Route path="account" element={<Account />} />
              <Route path="create" element={<CreateUploadPlaceholder />} />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
