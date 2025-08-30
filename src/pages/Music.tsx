import { useState, useMemo } from "react";
import { useViewStateStore } from "../hooks/stores/useViewStateStore";
import { DisplayJamendoSongCard } from "../components/DisplayJamendoSongCard";
import { SearchInput } from "../components/SearchInput";

// i18n
import { Link } from "react-router-dom";
import {
  useJamendoTracksInfinite,
  useJamendoAlbums,
  useJamendoArtists,
  useJamendoPlaylists,
} from "../hooks/query/jamendo.queries.ts";
import { DisplayAlbum } from "../components/DisplayAlbum.tsx";
import { setArtistImage } from "../utils/artistHelper.ts";
import { DisplayPlaylist } from "../components/DisplayPlaylist.tsx";

export default function Music() {
  const [query, setQuery] = useState("");
  const { setSearchQuery, searchQuery, showSearchResults } =
    useViewStateStore();

  const { data: tracksData } = useJamendoTracksInfinite(searchQuery, 12);
  const { data: albums, isLoading: isAlbumsLoading } = useJamendoAlbums(
    searchQuery,
    12,
  );
  const { data: artists, isLoading: isArtistsLoading } = useJamendoArtists(
    searchQuery,
    12,
  );
  const { data: playlists, isLoading: isPlaylistsLoading } =
    useJamendoPlaylists(searchQuery, 12);

  // flatten pages -> an array of tracks
  const tracks = useMemo(
    () => tracksData?.pages.flatMap((p) => p.results) ?? [],
    [tracksData],
  );

  const handleSearch = () => {
    if (query.trim()) {
      showSearchResults();
      setSearchQuery(query);
    }
  };

  return (
    <div className="flex flex-col bg-[#371A4D] text-white h-screen w-full p-6 pt-16 mb-24 overflow-hidden">
      <div className="w-full max-w-2xl mx-auto mb-6">
        <SearchInput query={query} setQuery={setQuery} onClick={handleSearch} />
      </div>
      <div className="flex-1 overflow-y-auto space-y-10 pr-1 py-4">
        {/* 1) Tracks */}
        {tracks && tracks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <Link to={`/search/tracks/${query}`}>
                <h2 className="text-xl font-bold">Titel</h2>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {tracks.map((track, idx) => {
                return (
                  <div key={track.id}>
                    <DisplayJamendoSongCard
                      songData={track}
                      idx={idx}
                      allTracks={tracks}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2) Albums */}
        {((albums && albums.length > 0) || isAlbumsLoading) && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <Link to={`/search/albums/${query}`}>
                <h2 className="text-xl font-bold">Alben</h2>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {albums &&
                albums.length &&
                albums.map((a) => <DisplayAlbum key={a.id} album={a} />)}
              {isAlbumsLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-[#1f1f1f] animate-pulse"
                  />
                ))}
            </div>
          </section>
        )}

        {/* 3) Artists */}
        {((artists && artists.length > 0) || isArtistsLoading) && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <Link to={`/search/artists/${query}`}>
                <h2 className="text-xl font-bold">Artists</h2>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
              {artists &&
                artists.length &&
                artists.map((ar) => {
                  const imageSrc = setArtistImage(ar);
                  return (
                    <div key={ar.id} className="flex flex-col items-center">
                      <div className="w-28 h-28 rounded-lg overflow-hidden bg-black">
                        <img
                          src={imageSrc}
                          alt={ar.name}
                          className="w-full h-full object-scale-down"
                        />
                      </div>
                      <div className="mt-2 text-sm">{ar.name}</div>
                    </div>
                  );
                })}
              {isArtistsLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-28 h-28 rounded-full bg-[#1f1f1f] animate-pulse"
                  />
                ))}
            </div>
          </section>
        )}

        {/* 4) Playlists */}
        {((playlists && playlists.length > 0) || isPlaylistsLoading) && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <Link to={`/search/playlists/${query}`}>
                <h2 className="text-xl font-bold">Playlists</h2>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {playlists &&
                playlists.length &&
                playlists.map((pl) => {
                  return <DisplayPlaylist playlist={pl} />;
                })}
              {isPlaylistsLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-[#1f1f1f] animate-pulse"
                  />
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
