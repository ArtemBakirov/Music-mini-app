import { useAccountStore } from "../../hooks/stores/useAccountStore.ts";
import { useLibrary } from "../../hooks/query/library.queries.ts";
import { RenderAlbums } from "../YoutubePages/RenderAlbums.tsx";

export const MyLibraryAlbums = () => {
  const profile = useAccountStore((s) => s.profile);
  const address = profile.address || "";

  const { data, isLoading, isError } = useLibrary(address, "album", 1, 50);

  console.log("data", data);

  const allAlbumsMeta = data?.items?.map((item) => {
    console.log("item avatar", item.avatar);
    return {
      ...item.meta,
      thumbnail: item.meta.thumbnails.high,
      id: item.meta.playlistId,
    };
  });

  console.log("all meta", allAlbumsMeta);

  return <div>{allAlbumsMeta && <RenderAlbums albums={allAlbumsMeta} />}</div>;
};
