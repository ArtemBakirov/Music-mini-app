import { Song } from "../../types/youtube.types.ts";
import { useMemo } from "react";
import { DisplayYoutubeSongCard } from "../../components/DisplayYoutubeSongCard.tsx";
import { Link } from "react-router-dom";

type RenderTracksProps = {
  tracks: Song[];
  query: string;
};

export const RenderTracks = ({ tracks, query }: RenderTracksProps) => {
  const tracksGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {tracks.map((v, idx) => (
          <div key={idx}>
            <DisplayYoutubeSongCard song={v} allTracks={tracks} />
          </div>
        ))}
      </div>
    ),
    [tracks],
  );

  return (
    <>
      {
        <section>
          <div className="flex items-center justify-between mb-3">
            <Link to={`/ytsearch/tracks/${encodeURIComponent(query)}`}>
              <h2 className="text-xl font-bold">Titel</h2>
            </Link>
          </div>
          {tracksGrid}
        </section>
      }
    </>
  );
};
