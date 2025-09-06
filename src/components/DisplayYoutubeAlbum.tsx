import { Link } from "react-router-dom";

export function DisplayYoutubeAlbum({
  playlistId,
  title,
  channelTitle,
  thumbnail,
}: {
  playlistId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
}) {
  return (
    <Link to={`/yt/playlist/${playlistId}`}>
      <div className="group">
        <div className="aspect-square overflow-hidden rounded-lg bg-[#222]">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:opacity-90 transition"
          />
        </div>
        <div className="mt-2 text-sm font-medium truncate">{title}</div>
        <div className="text-xs text-gray-400 truncate">{channelTitle}</div>
      </div>
    </Link>
  );
}
