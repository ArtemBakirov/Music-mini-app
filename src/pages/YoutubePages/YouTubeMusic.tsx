import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { searchYouTubeAll } from "../../api/youtubeApi.ts";
import {
  DisplayYoutubeSongCard,
  YtTrackHandle,
} from "../../components/DisplayYoutubeSongCard.tsx";
import { DisplayYoutubeAlbum } from "../../components/DisplayYoutubeAlbum.tsx";
import { DisplayYoutubeArtist } from "../../components/DisplayYoutubeArtist.tsx";
import { SearchYoutubeInput } from "../../components/SearchYoutubeInput.tsx";
import { Song } from "../../types/youtube.types.ts";
import { RenderTracks } from "./RenderTracks.tsx";
import { RenderAlbums } from "./RenderAlbums.tsx";
import { RenderArtists } from "./RenderArtists.tsx";

const YT_API_KEY =
  import.meta.env.VITE_YT_API_KEY || "AIzaSyCUpYD21lRefE6F_WuO993Z4ityPj3aQdw"; // your example key
// console.log("import meta env", import.meta.env.VITE_YT_API_KEY);
export default function YouTubeMusic() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [priming, setPriming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [videos, setVideos] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);

  // tracks with videoId changed to audioId for correct types
  const [audioTracks, setAudioTracks] = useState<Song[]>([]);

  // Refs to all track cards (for priming)
  const itemRefs = useRef<Array<YtTrackHandle | null>>([]);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setError(null);
    setLoading(true);
    setVideos([]);
    setPlaylists([]);
    setChannels([]);

    try {
      const { videos, playlists, channels } = await searchYouTubeAll(
        q,
        YT_API_KEY,
        12,
      );
      console.log("search youtube videos", videos);
      const tracks = videos.map(({ id, ...rest }, idx) => {
        return {
          ...rest,
          audioId: id,
        };
      });
      setAudioTracks(tracks);
      setVideos(videos);
      setPlaylists(playlists);
      setChannels(channels);
      setLoading(false);
    } catch (e: any) {
      setError(e.message ?? "Search failed");
      setLoading(false);
      setPriming(false);
    }
  };

  const tracksGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {audioTracks.map((v, idx) => (
          <div key={idx}>
            <DisplayYoutubeSongCard song={v} allTracks={audioTracks} />
          </div>
        ))}
      </div>
    ),
    [videos],
  );

  return (
    <div className="flex flex-col bg-[#371A4D] text-white h-screen w-full p-6 pt-16 mb-24 overflow-hidden">
      <>
        <div className="w-full max-w-2xl mx-auto mb-6">
          <SearchYoutubeInput onSubmit={handleSearch} />
        </div>

        <div
          className={`flex-1 overflow-y-auto space-y-10 pr-1 py-4 relative
        ${priming ? "opacity-30" : "opacity-100"}
        `}
        >
          {error && (
            <div className="bg-red-600/30 text-red-100 p-3 rounded-md">
              {error}
            </div>
          )}

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
          {!loading && videos.length > 0 && (
            <RenderTracks tracks={audioTracks} query={query} />
          )}

          {/* Albums (playlists) */}
          {!loading && playlists.length > 0 && (
            <RenderAlbums albums={playlists} query={query} />
          )}

          {/* Artists (channels) */}
          {!loading && channels.length > 0 && (
            <RenderArtists artists={channels} query={query} />
          )}
        </div>
      </>
    </div>
  );
}
