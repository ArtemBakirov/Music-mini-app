import { useInfiniteQuery } from "@tanstack/react-query";
import { searchYouTubeVideosPaged, YtVideoHit } from "../../api/youtubeApi";

export function useYouTubeTracksInfinite(
  query: string,
  pageSize = 24,
  apiKey: string,
) {
  return useInfiniteQuery({
    queryKey: ["yt", "tracks", query, pageSize],
    enabled: !!query,
    initialPageParam: undefined as string | undefined, // pageToken
    getNextPageParam: (last) => last.nextPageToken ?? undefined,
    queryFn: async ({ pageParam }) => {
      const page = await searchYouTubeVideosPaged(
        query,
        apiKey,
        pageSize,
        pageParam,
      );
      return page;
    },
    staleTime: 1000 * 60 * 5,
  });
}
