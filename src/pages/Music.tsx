import { useEffect, useState, useRef } from "react";
import "./Music.css";
import { SdkService } from "../bastyon-sdk/sdkService.ts";
import {
  useInfiniteYoutubeSearch,
  usePlaylistSongs,
} from "../hooks/query/playlist.queries.ts";

// zustand store for selected playList
import { useViewStateStore } from "../hooks/stores/useViewStateStore";

export default function Music() {
  useEffect(() => {
    void SdkService.init();
    console.log("testing sending notifications");
    void SdkService.requestPermissions();
    void SdkService.getUsersInfo();
  }, []);
  // look for the iframe
  const iframeEls = document.getElementsByName("iframe");
  iframeEls.forEach((iframe) => {
    console.log("iframe found", iframe);
  });

  const [query, setQuery] = useState(""); // User typing
  const {
    viewMode,
    searchQuery,
    selectedPlaylistId,
    setSearchQuery,
    showSearchResults,
  } = useViewStateStore();

  // react-query hooks
  const {
    data: searchResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteYoutubeSearch(searchQuery);

  const { data: playlistResults } = usePlaylistSongs(selectedPlaylistId);
  console.log("search results", searchResults);
  //
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const observerRef = (node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) {
      observer.current.observe(node);
      lastElementRef.current = node;
    }
  };

  const handleSearch = () => {
    showSearchResults();
    if (query.trim()) {
      setSearchQuery(query); // Triggers the query hook
    }
  };
  const videoId = "8mGBaXPlri8";
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&controls=1&rel=0`;

  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState([]);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      const res = await fetch(
        "https://api.jamendo.com/v3.0/tracks/?client_id=17ed92bf&format=json&limit=10&fuzzytags=chill",
      );
      const data = await res.json();
      console.log(data);
      setTracks(data.results);
    };
    fetchTracks();
  }, []);

  const handlePlay = (track: any) => {
    if (currentTrack?.id !== track.id) {
      setCurrentTrack(track);
      setIsPlaying(false);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = track.audio;
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 0);
    } else {
      // Toggle playback
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🎧 Chill Tracks (Jamendo)</h2>

      <ul className="space-y-4">
        {tracks.map((track) => (
          <li
            key={track.id}
            className={`border p-4 rounded-lg flex items-center gap-4 ${
              currentTrack?.id === track.id ? "bg-purple-50" : ""
            }`}
          >
            <img
              src={track.album_image}
              alt={track.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-grow">
              <div className="font-semibold">{track.name}</div>
              <div className="text-sm text-gray-500">{track.artist_name}</div>
            </div>
            <button
              onClick={() => handlePlay(track)}
              className="bg-purple-600 text-white px-3 py-1 rounded"
            >
              {currentTrack?.id === track.id && isPlaying
                ? "⏸ Pause"
                : "▶️ Play"}
            </button>
          </li>
        ))}
      </ul>

      {/* 🔇 Hidden or styleable audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        style={{ display: "none" }} // or use your custom player UI
      />
    </div>
  );
}
