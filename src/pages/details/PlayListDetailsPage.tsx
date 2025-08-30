import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useJamendoPlaylist } from "../../hooks/query/jamendo.queries";
import { DisplayJamendoSongCard } from "../../components/DisplayJamendoSongCard";
import { useJamendoPlayerStore } from "../../hooks/stores/useJamendoPlayerStore";

export default function PlaylistDetailsPage() {
  const { playlistId } = useParams();
  const {
    data: playlist,
    isLoading,
    isError,
    error,
  } = useJamendoPlaylist(playlistId);

  // When the playlist loads, push all its tracks into the global queue
  const setQueue = useJamendoPlayerStore((s) => s.setQueue);
  useEffect(() => {
    if (playlist?.tracks?.length) {
      setQueue(playlist.tracks);
    }
  }, [playlist, setQueue]);

  const tracks = useMemo(() => playlist?.tracks ?? [], [playlist]);

  if (isLoading) {
    return (
      <div className="p-6 mt-16 text-white bg-[#371A4D]">Loading playlist…</div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 mt-16 text-red-300 bg-[#371A4D]">
        {(error as Error)?.message || "Failed to load playlist"}
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6 mt-16 text-white bg-[#371A4D]">
        Playlist not found.
      </div>
    );
  }

  const imageSrc = playlist.image || "/placeholder-playlist.png"; // optional fallback

  return (
    <div className="flex flex-col text-white h-screen w-full p-6 pt-16 mb-24 overflow-hidden bg-[#371A4D]">
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-40 h-40 rounded-md overflow-hidden bg-[#222] shadow-lg">
          <img
            src={imageSrc}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="uppercase text-xs tracking-widest opacity-80">
            Playlist
          </div>
          <h1 className="text-3xl font-extrabold mt-1">{playlist.name}</h1>
          {playlist.user_name && (
            <div className="text-sm opacity-90 mt-1">
              by {playlist.user_name}
            </div>
          )}
          <div className="text-xs opacity-70 mt-1">
            {tracks.length} {tracks.length === 1 ? "Titel" : "Titel"}
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto pr-1 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {tracks.map((t, idx) => (
            <div key={t.id}>
              {/* Ensure each card has a cover: prefer track.album_image, fallback to playlist image */}
              <DisplayJamendoSongCard
                songData={{ ...t, album_image: t.album_image || imageSrc }}
                idx={idx}
                allTracks={tracks}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
