import { useState } from "react";
import { SearchYoutubeInput } from "../../components/SearchYoutubeInput.tsx";
import { RenderTracks } from "./RenderTracks.tsx";
import { RenderAlbums } from "./RenderAlbums.tsx";
import { RenderArtists } from "./RenderArtists.tsx";
import {
  useYouTubeChannelsFirstPage,
  useYouTubePlaylistsFirstPage,
  useYouTubeTracksFirstPage,
} from "../../hooks/query/youtube.queries.ts";

const YT_API_KEY =
  import.meta.env.VITE_YT_API_KEY || "AIzaSyCUpYD21lRefE6F_WuO993Z4ityPj3aQdw";
export default function YouTubeMusic() {
  const [query, setQuery] = useState("");

  const {
    data: videosData,
    isLoading: videosLoading,
    isError: videosError,
  } = useYouTubeTracksFirstPage(query, "", 12, YT_API_KEY);
  console.log("videosData", videosData);
  const {
    data: playlistsData,
    isLoading: isPlaylistsLoading,
    isError: isPlaylistsError,
  } = useYouTubePlaylistsFirstPage(query, "", 12, YT_API_KEY);
  const {
    data: channelsData,
    isLoading: isChannelsLoading,
    isError: isChannelsError,
  } = useYouTubeChannelsFirstPage(query, 12, YT_API_KEY);

  const loading = videosLoading || isPlaylistsLoading || isChannelsLoading;
  const tracks = videosData?.items.map(({ id, ...rest }) => {
    return {
      ...rest,
      audioId: id,
    };
  });

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
  };

  return (
    <div className="flex flex-col bg-[#371A4D] text-white h-screen w-full p-6 pt-16 mb-24 overflow-hidden">
      <>
        <div className="w-full max-w-2xl mx-auto mb-6">
          <SearchYoutubeInput onSubmit={handleSearch} />
        </div>

        <div className={`flex-1 overflow-y-auto space-y-10 pr-1 py-4 relative`}>
          {loading && (
            <div className="space-y-6">
              <div className="h-6 w-40 bg-[#1f1f1f] rounded animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-[#1f1f1f] rounded-md animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tracks */}
          {!videosLoading && tracks && tracks.length > 0 && (
            <RenderTracks mode={"search"} tracks={tracks} query={query} />
          )}

          {/* Albums (playlists) */}
          {!isPlaylistsLoading &&
            playlistsData?.items &&
            playlistsData.items.length > 0 && (
              <RenderAlbums
                mode={"search"}
                albums={playlistsData.items}
                query={query}
              />
            )}

          {/* Artists (channels) */}
          {!isChannelsLoading &&
            channelsData?.items &&
            channelsData.items.length > 0 && (
              <RenderArtists artists={channelsData.items} query={query} />
            )}
        </div>
      </>
    </div>
  );
}
