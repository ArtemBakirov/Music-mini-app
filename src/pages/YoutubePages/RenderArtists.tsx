import { Link } from "react-router-dom";
import { DisplayYoutubeArtist } from "../../components/DisplayYoutubeArtist.tsx";

type RenderArtistsProps = {
  query: string;
  artists: any[];
};

export const RenderArtists = ({ query, artists }: RenderArtistsProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <Link to={`ytsearch/artists/${encodeURIComponent(query)}`}>
          <h2 className="text-xl font-bold">Artists</h2>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
        {artists.map((c: any) => (
          <DisplayYoutubeArtist
            id={c.id}
            key={c.id}
            title={c.title}
            thumbnail={c.thumbnail}
          />
        ))}
      </div>
    </section>
  );
};
