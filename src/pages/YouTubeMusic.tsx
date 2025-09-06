import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { searchYouTubeAll } from "../api/youtubeApi.ts";
import {
  DisplayYoutubeSongCard,
  YtTrackHandle,
} from "../components/DisplayYoutubeSongCard";
import { DisplayYoutubeAlbum } from "../components/DisplayYoutubeAlbum";
import { DisplayYoutubeArtist } from "../components/DisplayYoutubeArtist.tsx";
import { SearchYoutubeInput } from "../components/SearchYoutubeInput.tsx";
// import "../components/yt/yt.css";

const YT_API_KEY =
  import.meta.env.VITE_YT_API_KEY || "AIzaSyCUpYD21lRefE6F_WuO993Z4ityPj3aQdw"; // your example key

export default function YouTubeMusic() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [priming, setPriming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [videos, setVideos] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);

  // Refs to all track cards (for priming)
  const itemRefs = useRef<Array<YtTrackHandle | null>>([]);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setError(null);
    setLoading(true);
    setPriming(false);
    setVideos([]);
    setPlaylists([]);
    setChannels([]);

    try {
      const { videos, playlists, channels } = await searchYouTubeAll(
        q,
        YT_API_KEY,
        12,
      );
      setVideos(videos);
      setPlaylists(playlists);
      setChannels(channels);
      setLoading(false);

      // === Special step: PRIME all track players BEFORE UI ===
      setPriming(true);
      await primeAllTracks();
      setPriming(false);
    } catch (e: any) {
      setError(e.message ?? "Search failed");
      setLoading(false);
      setPriming(false);
    }
  };

  const primeAllTracks = async () => {
    // Wait a microtick to ensure child refs are assigned
    await new Promise((r) => setTimeout(r, 0));
    const primes = itemRefs.current
      .map((h) => h?.prime())
      .filter(Boolean) as Promise<void>[];
    await Promise.allSettled(primes);
  };

  // When videos list changes (e.g., new search), reset ref array length
  useEffect(() => {
    itemRefs.current = new Array(videos.length).fill(null);
  }, [videos.length]);

  const tracksGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {videos.map((v, i) => (
          <DisplayYoutubeSongCard
            key={v.id}
            videoId={v.id}
            title={v.title}
            channelTitle={v.channelTitle}
            thumbnail={v.thumbnail}
            ref={(el) => (itemRefs.current[i] = el)}
          />
        ))}
      </div>
    ),
    [videos],
  );

  return (
    <div className="flex flex-col bg-[#371A4D] text-white h-screen w-full p-6 pt-16 mb-24 overflow-hidden">
      <div className="w-full max-w-2xl mx-auto mb-6">
        <SearchYoutubeInput onSubmit={handleSearch} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-10 pr-1 py-4">
        {error && (
          <div className="bg-red-600/30 text-red-100 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Loader / Priming Gate */}
        {(loading || priming) && (
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
        {!loading && !priming && videos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <Link to={`/yt/search/tracks/${encodeURIComponent(query)}`}>
                <h2 className="text-xl font-bold">Titel</h2>
              </Link>
            </div>
            {tracksGrid}
          </section>
        )}

        {/* Albums (playlists) */}
        {!loading && !priming && playlists.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <Link to={`/yt/search/playlists/${encodeURIComponent(query)}`}>
                <h2 className="text-xl font-bold">Alben</h2>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {playlists.map((p: any) => (
                <DisplayYoutubeAlbum
                  key={p.id}
                  playlistId={p.id}
                  title={p.title}
                  channelTitle={p.channelTitle}
                  thumbnail={p.thumbnail}
                />
              ))}
            </div>
          </section>
        )}

        {/* Artists (channels) */}
        {!loading && !priming && channels.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <Link to={`/yt/search/channels/${encodeURIComponent(query)}`}>
                <h2 className="text-xl font-bold">Artists</h2>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
              {channels.map((c: any) => (
                <DisplayYoutubeArtist
                  key={c.id}
                  title={c.title}
                  thumbnail={c.thumbnail}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
