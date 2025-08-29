import { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useJamendoPlaylistsInfinite } from "../hooks/query/jamendo.queries";

export default function MusicPlaylists() {
  const { query = "" } = useParams();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useJamendoPlaylistsInfinite(query, 24);

  const playlists = useMemo(
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
      <h1 className="text-xl font-bold">Playlists</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {playlists.map((pl, idx) => {
          const isLast = idx === playlists.length - 1;
          return (
            <div
              key={pl.id}
              ref={isLast ? lastRef : undefined}
              className="group"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-[#222]">
                <img
                  src={pl.image}
                  alt={pl.name}
                  className="w-full h-full object-cover group-hover:opacity-90 transition"
                />
              </div>
              <div className="mt-2 text-sm font-medium line-clamp-1">
                {pl.name}
              </div>
              {pl.user_name && (
                <div className="text-xs text-gray-400 line-clamp-1">
                  {pl.user_name}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {isFetchingNextPage && (
        <div className="text-sm opacity-70">Loading more…</div>
      )}
      {!hasNextPage && playlists.length > 0 && (
        <div className="text-sm opacity-70">No more results</div>
      )}
    </div>
  );
}
