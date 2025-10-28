import { Link } from "react-router-dom";
import { DisplayYoutubeAlbum } from "../../components/DisplayYoutubeAlbum.tsx";
import { Mode } from "../../types/youtube.types.ts";

type RenderAlbumsProps = {
  query: string;
  albums: any[];
  mode: Mode;
};

export const RenderAlbums = ({ query, albums, mode }: RenderAlbumsProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <Link to={`/ytsearch/playlists/${mode}/${encodeURIComponent(query)}`}>
          <h2 className="text-xl font-bold">Alben</h2>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {albums.map((p: any) => (
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
  );
};
