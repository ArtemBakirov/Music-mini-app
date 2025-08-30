import { JamendoAlbum } from "../hooks/query/jamendo.queries";
import { Link } from "react-router-dom";
import { Ref } from "react";
import { getExistingImage } from "../utils/albumsHelper.ts";

export const DisplayAlbum = ({
  album,
  lastRef,
}: {
  album: JamendoAlbum;
  lastRef?: Ref<HTMLDivElement>;
}) => {
  const imageSrc = getExistingImage(album);

  return (
    <>
      <Link to={`/album/${album.id}`}>
        <div
          key={album.id}
          className="group"
          ref={lastRef ? lastRef : undefined}
        >
          <div className="aspect-square overflow-hidden rounded-lg bg-[#222]">
            <img
              src={imageSrc}
              alt={album.name}
              className="w-full h-full object-cover group-hover:opacity-90 transition"
            />
          </div>
          <div className="mt-2 text-sm font-medium truncate">{album.name}</div>
          <div className="text-xs text-gray-400 truncate">
            {album.artist_name}
          </div>
        </div>
      </Link>
    </>
  );
};
