import { useLibrary } from "../../hooks/query/library.queries.ts";
import { useAccountStore } from "../../hooks/stores/useAccountStore.ts";
// Optionally hydrate from YT for fresh metadata (see notes below).

export const MyLibraryTracks = () => {
  const profile = useAccountStore((s) => s.profile);
  const address = profile.address || "";

  const { data, isLoading, isError } = useLibrary(address, "track", 1, 50);

  console.log("data", data);

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (isError) return <div className="p-6 text-red-400">Failed to load.</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <h1>My Tracks</h1>
      {data?.items.map((it: any) => (
        <div
          key={it._id}
          className="flex items-center gap-3 bg-[#2D0F3A] p-3 rounded"
        >
          <img
            src={it.snapshot?.thumbnail}
            className="w-14 h-14 rounded object-cover"
          />
          <div className="min-w-0">
            <div className="font-semibold truncate">{it.snapshot?.title}</div>
            <div className="text-sm text-gray-300 truncate">
              {it.snapshot?.subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
