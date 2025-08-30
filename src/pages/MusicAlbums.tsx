import { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useJamendoAlbumsInfinite } from "../hooks/query/jamendo.queries";
import { DisplayAlbum } from "../components/DisplayAlbum.tsx";

export default function MusicAlbums() {
  const { query = "" } = useParams();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useJamendoAlbumsInfinite(query, 24);

  const albums = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );

  const observer = useRef<IntersectionObserver | null>(null);
  const lastRef = (node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
    });
    if (node) observer.current.observe(node);
  };

  if (status === "pending") return <div className="p-6 mt-16">Loading…</div>;
  if (status === "error")
    return (
      <div className="p-6 mt-16 text-red-400">{(error as Error).message}</div>
    );

  return (
    <div className="h-screen w-full flex flex-col p-6 mt-16 gap-6 overflow-hidden mb-18">
      <h1 className="text-xl font-bold">Alben</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 overflow-y-auto">
        {albums.map((a, idx) => {
          const isLast = idx === albums.length - 1;
          console.log("album", a);
          return (
            <DisplayAlbum album={a} lastRef={isLast ? lastRef : undefined} />
          );
        })}
      </div>
      {isFetchingNextPage && (
        <div className="text-sm opacity-70">Loading more…</div>
      )}
      {!hasNextPage && albums.length > 0 && (
        <div className="text-sm opacity-70">No more results</div>
      )}
    </div>
  );
}
