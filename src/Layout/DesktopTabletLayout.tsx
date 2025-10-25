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
import RenderInfiniteTracks from "../pages/YoutubePages/RenderInfiniteTracks.tsx";
import RenderInfiniteArtists from "../pages/YoutubePages/RenderInfiniteArtists.tsx";
import RenderArtist from "../pages/YoutubePages/RenderArtist.tsx";
import { CreateUploadPlaceholder } from "../pages/CreateUploadPlaceholder.tsx";
import { Library } from "../pages/Library/Library.tsx";
import { MyLibraryTracks } from "../pages/Library/MyLibraryTracks.tsx";
import { MyLibraryArtists } from "../pages/Library/MyLibraryArtists.tsx";
import { MyLibraryAlbums } from "../pages/Library/MyLibraryAlbums.tsx";
import { MyLibraryLastAdded } from "../pages/Library/MyLibraryLastAdded.tsx";
import { Playlists } from "../pages/Playlists/Playlists.tsx";
import RenderInfiniteAlbums from "../pages/YoutubePages/RenderInfiniteAlbums.tsx";
import { RenderAlbum } from "../pages/YoutubePages/RenderAlbum.tsx";

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
                element={<RenderInfiniteTracks />}
              />
              <Route
                path="ytsearch/artists/:query"
                element={<RenderInfiniteArtists />}
              />
              <Route
                path="ytsearch/album/:albumId"
                element={<AlbumDetailsPage />}
              />
              <Route
                path="ytsearch/artist/:channelId"
                element={<RenderArtist />}
              />

              {/*<Route
                path="ytsearch/albums/:query"
                element={<YouTubeMusicAlbums />}
              />  */}

              <Route
                path="ytsearch/playlists/:query"
                element={<RenderInfiniteAlbums />}
              />
              <Route
                path="ytsearch/playlist/:query"
                element={<RenderAlbum />}
              />

              <Route path="album/:albumId" element={<AlbumDetailsPage />} />
              <Route
                path="playlist/:playlistId"
                element={<PlaylistDetailsPage />}
              />
              <Route path="account" element={<Account />} />
              <Route path="create" element={<CreateUploadPlaceholder />} />

              {/* My Library */}
              <Route
                path="library"
                element={<Library />}
                children={
                  <>
                    <Route index element={<MyLibraryTracks />} />
                    <Route path="albums" element={<MyLibraryAlbums />} />
                    <Route path="artists" element={<MyLibraryArtists />} />
                    <Route path="recent" element={<MyLibraryLastAdded />} />
                  </>
                }
              />
              {/* Playlists */}
              <Route
                path="playlists"
                element={<Playlists />}
                children={<></>}
              />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
