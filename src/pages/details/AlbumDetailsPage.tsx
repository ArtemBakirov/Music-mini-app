import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useJamendoAlbum } from "../../hooks/query/jamendo.queries";
import { DisplayJamendoSongCard } from "../../components/DisplayJamendoSongCard";
import { useJamendoPlayerStore } from "../../hooks/stores/useJamendoPlayerStore";

export default function AlbumDetailsPage() {
  const { albumId } = useParams();
  const { data: album, isLoading, isError, error } = useJamendoAlbum(albumId);

  // Optional: set the queue to this album's tracks when it loads
  const setQueue = useJamendoPlayerStore((s) => s.setQueue);
  useEffect(() => {
    if (album?.tracks?.length) {
      setQueue(album.tracks);
    }
  }, [album, setQueue]);

  const tracks = useMemo(() => album?.tracks ?? [], [album]);

  if (isLoading) {
    return <div className="p-6 mt-16 text-white">Loading album…</div>;
  }

  if (isError) {
    return (
      <div className="p-6 mt-16 text-red-300">
        {(error as Error)?.message || "Failed to load album"}
      </div>
    );
  }

  if (!album) {
    return <div className="p-6 mt-16 text-white">Album not found.</div>;
  }

  return (
    <div className="flex flex-col text-white h-screen w-full p-6 pt-16 mb-24 overflow-hidden bg-[#371A4D]">
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-40 h-40 rounded-md overflow-hidden bg-[#222] shadow-lg">
          <img
            src={album.image}
            alt={album.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="uppercase text-xs tracking-widest opacity-80">
            Album
          </div>
          <h1 className="text-3xl font-extrabold mt-1">{album.name}</h1>
          {album.artist_name && (
            <div className="text-sm opacity-90 mt-1">{album.artist_name}</div>
          )}
          <div className="text-xs opacity-70 mt-1">
            {album.release_date
              ? new Date(album.release_date).getFullYear()
              : ""}{" "}
            • {tracks.length} {tracks.length === 1 ? "Titel" : "Titel"}
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto pr-1 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {tracks.map((t, idx) => (
            <div key={t.id}>
              <DisplayJamendoSongCard
                songData={t}
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
