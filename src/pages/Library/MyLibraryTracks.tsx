import { useLibrary } from "../../hooks/query/library.queries.ts";
import { useAccountStore } from "../../hooks/stores/useAccountStore.ts";
import { DisplayYoutubeSongCard } from "../../components/DisplayYoutubeSongCard.tsx";
// Optionally hydrate from YT for fresh metadata (see notes below).

export const MyLibraryTracks = () => {
  const profile = useAccountStore((s) => s.profile);
  const address = profile.address || "";

  const { data, isLoading, isError } = useLibrary(address, "track", 1, 50);

  console.log("data", data);

  const allTracks = data?.items.map((item) => {
    return item.song;
  });

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (isError) return <div className="p-6 text-red-400">Failed to load.</div>;

  return (
    <div className="h-screen w-full flex flex-col p-6 pt-16 gap-6 overflow-hidden bg-[#371A4D] text-white">
      <h1>My Tracks</h1>
      {data?.items.map((it: any, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3`}
        >
          <DisplayYoutubeSongCard allTracks={allTracks} song={it.song} />
        </div>
      ))}
    </div>
  );
};
