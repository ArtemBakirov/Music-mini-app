import { useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useJamendoAlbumsInfinite } from "../hooks/query/jamendo.queries";

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
            <Link to={`/album/${a.id}`}>
              <div
                key={a.id}
                ref={isLast ? lastRef : undefined}
                className="group"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-[#222]">
                  <img
                    src={a.image}
                    alt={a.name}
                    className="w-full h-full object-cover group-hover:opacity-90 transition"
                  />
                </div>
                <div className="mt-2 text-sm font-medium truncate">
                  {a.name}
                </div>
                {a.artist_name && (
                  <div className="text-xs text-gray-400 truncate">
                    {a.artist_name}
                  </div>
                )}
              </div>
            </Link>
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
