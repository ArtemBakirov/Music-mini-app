import { Link } from "react-router-dom";

export function DisplayYoutubeArtist({
  title,
  thumbnail,
  id,
}: {
  title: string;
  thumbnail: string;
  id: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-28 h-28 rounded-lg overflow-hidden bg-black">
        <Link
          to={`/ytsearch/artist/${id}`}
          replace
          className="w-28 h-28 rounded-full overflow-hidden bg-[#222] block"
        >
          <img
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
      <div className="mt-2 text-sm">{title}</div>
    </div>
  );
}
