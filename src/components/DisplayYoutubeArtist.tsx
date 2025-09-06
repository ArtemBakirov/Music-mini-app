export function DisplayYoutubeArtist({
  title,
  thumbnail,
}: {
  title: string;
  thumbnail: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-28 h-28 rounded-lg overflow-hidden bg-black">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mt-2 text-sm">{title}</div>
    </div>
  );
}
