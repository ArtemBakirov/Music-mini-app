import { useParams } from "react-router-dom";
import {
  useYoutubeChannelMeta,
  useYoutubeChannelPlaylistsFirstPage,
  useYoutubeChannelVideosFirstPage,
} from "../../hooks/query/youtube.queries.ts";
import { YouTubeArtistBanner } from "./YouTubeArtistBanner.tsx";
import Play from "../../assets/icons/play.svg?react";
import {
  useSavedMap,
  useToggleSave,
} from "../../hooks/query/library.queries.ts";
import { useAccountStore } from "../../hooks/stores/useAccountStore.ts";
import { RenderTracks } from "./RenderTracks.tsx";
import { RenderAlbums } from "./RenderAlbums.tsx";

export default function RenderArtist() {
  const { channelId = "" } = useParams();
  const YT_API_KEY =
    import.meta.env.VITE_YT_API_KEY ||
    "AIzaSyCUpYD21lRefE6F_WuO993Z4ityPj3aQdw";
  const {
    data: meta,
    isLoading: isLoadingMeta,
    isError: isErrorMeta,
  } = useYoutubeChannelMeta(YT_API_KEY, channelId);

  const {
    data: videosData,
    isLoading: isLoadingVideos,
    isError: isErrorVideos,
  } = useYoutubeChannelVideosFirstPage(YT_API_KEY, channelId, 24);
  const {
    data: playlistsData,
    isLoading: isLoadingPlaylists,
    isError: isErrorPlaylists,
  } = useYoutubeChannelPlaylistsFirstPage(YT_API_KEY, channelId, 12);

  const profile = useAccountStore((s) => s.profile);
  const address = profile?.address || "";

  const batchKeyIds = [channelId];
  // console.log("batchedkeyIds", batchKeyIds);
  const { data: savedMap } = useSavedMap(address, "artist", batchKeyIds);
  // console.log("savedMap", savedMap);
  const isSaved = savedMap?.[channelId] ?? false;
  // console.log("isSaved footer", isSaved);
  const { mutate } = useToggleSave();
  // console.log("mutation is pending", isPending);

  const handleAddToLibrary = () => {
    console.log("add artist to library");
    if (channelId) {
      if (isSaved) {
        // console.log("removing");
        mutate({
          channelId,
          address: profile.address || "",
          action: "remove",
          kind: "artist",
        });
      } else {
        // console.log("adding");
        mutate({
          channelId,
          address: profile.address || "",
          action: "add",
          kind: "artist",
        });
      }
    }
  };

  if (!channelId) return <div className="p-6 mt-16">No channel.</div>;

  const tracks = videosData?.items.map(({ id, ...rest }) => {
    return {
      ...rest,
      audioId: id,
    };
  });

  return (
    <div className="h-screen overflow-hidden w-full flex flex-col gap-6 text-white bg-[#371A4D]">
      {/* HERO BANNER */}
      <>
        {meta && (
          <section className="relative w-full h-56 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
            {/* Background video or image */}
            {meta?.unsubscribedTrailer ? (
              <>
                <YouTubeArtistBanner videoId={meta.unsubscribedTrailer} />
                {/* subtle dark overlay for readability */}
                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : meta?.banner ? (
              <>
                <img
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  src={meta.banner}
                  alt={`${meta.title} banner`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#2D0F3A] to-[#371A4D]" />
            )}

            {/* Foreground content */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full px-6 pb-5 flex items-end justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {meta?.avatar && (
                    <img
                      src={meta.avatar}
                      alt={`${meta.title} avatar`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight truncate">
                      {meta?.title ?? "Channel"}
                    </h1>
                    {/* You can add stats/subscriber count if you fetch them */}
                  </div>
                </div>

                {/* Example actions (customize for your app) */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleAddToLibrary}
                    className="bg-white text-black rounded-full px-4 py-2 text-sm hover:opacity-90"
                  >
                    {isSaved ? "- Remove from Library" : "+ Add to Library"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
                  >
                    {<Play />}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
        {isLoadingMeta && (
          <div className="p-6 mt-16 text-white">Loading channel meta…</div>
        )}
        {isErrorMeta && (
          <div className="p-6 mt-16 text-red-400">
            Failed to load channel meta
          </div>
        )}
      </>
      <div className="overflow-y-auto p-6 mb-24 flex flex-col gap-6">
        {tracks && (
          <RenderTracks mode={"channel"} tracks={tracks} query={channelId} />
        )}
        {isLoadingVideos && (
          <div className="p-6 mt-16 text-white">Loading channel videos…</div>
        )}
        {isErrorVideos && (
          <div className="p-6 mt-16 text-red-400">
            Failed to load channel videos
          </div>
        )}
        {playlistsData && (
          <RenderAlbums
            mode={"channel"}
            albums={playlistsData.items}
            query={channelId}
          />
        )}
        {isLoadingPlaylists && (
          <div className="p-6 mt-16 text-white">Loading channel playlists…</div>
        )}
        {isErrorPlaylists && (
          <div className="p-6 mt-16 text-red-400">
            Failed to load channel playlists
          </div>
        )}
      </div>
    </div>
  );
}
