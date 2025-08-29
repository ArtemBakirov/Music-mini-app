import { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useJamendoArtistsInfinite } from "../hooks/query/jamendo.queries";

export default function MusicArtists() {
  const { query = "" } = useParams();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useJamendoArtistsInfinite(query, 24);

  const artists = useMemo(
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
    <div className="h-screen w-full flex flex-col p-6 mt-16 gap-6">
      <h1 className="text-xl font-bold">Künstler:innen</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
        {artists.map((ar, idx) => {
          const isLast = idx === artists.length - 1;
          return (
            <div
              key={ar.id}
              ref={isLast ? lastRef : undefined}
              className="flex flex-col items-center"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden bg-[#222]">
                <img
                  src={ar.image}
                  alt={ar.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 text-sm truncate max-w-28 text-center">
                {ar.name}
              </div>
            </div>
          );
        })}
      </div>
      {isFetchingNextPage && (
        <div className="text-sm opacity-70">Loading more…</div>
      )}
      {!hasNextPage && artists.length > 0 && (
        <div className="text-sm opacity-70">No more results</div>
      )}
    </div>
  );
}
