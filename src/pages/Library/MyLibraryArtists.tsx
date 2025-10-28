import { useLibrary } from "../../hooks/query/library.queries.ts";
import { useAccountStore } from "../../hooks/stores/useAccountStore.ts";
import { DisplayYoutubeSongCard } from "../../components/DisplayYoutubeSongCard.tsx";
// Optionally hydrate from YT for fresh metadata (see notes below).

export const MyLibraryArtists = () => {
  const profile = useAccountStore((s) => s.profile);
  const address = profile.address || "";

  const { data, isLoading, isError } = useLibrary(address, "artist", 1, 50);

  console.log("data", data);

  /* const allTracks = data?.items.map((item) => {
    return item.song;
  }); */

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (isError) return <div className="p-6 text-red-400">Failed to load.</div>;

  return (
    <div className="h-screen w-full flex flex-col p-6 pt-16 gap-6 overflow-hidden bg-[#371A4D] text-white">
      Artists
    </div>
  );
};
