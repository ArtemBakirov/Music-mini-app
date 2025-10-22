import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { searchYouTubeVideosPaged } from "../../api/youtubeApi";

export type YtChannelMeta = {
  id: string;
  title: string;
  avatar: string | null;
  banner: string | null;
  unsubscribedTrailer: string | null;
};

export async function fetchChannelMeta(
  apiKey: string,
  channelId: string,
): Promise<YtChannelMeta> {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet,brandingSettings");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to load channel meta (${res.status})`);
  const json = await res.json();

  const item = json.items?.[0];
  if (!item) throw new Error("Channel not found");

  const title = item.snippet?.title ?? "Channel";
  const avatar =
    item.snippet?.thumbnails?.high?.url ||
    item.snippet?.thumbnails?.medium?.url ||
    item.snippet?.thumbnails?.default?.url ||
    null;

  // YouTube returns a base URL for banner; you can add sizing suffix, e.g. "=w2120"
  const rawBanner: string | undefined =
    item.brandingSettings?.image?.bannerExternalUrl;
  const banner = rawBanner ? `${rawBanner}=w2120` : null;

  const unsubscribedTrailer: string | null =
    item.brandingSettings?.channel?.unsubscribedTrailer ?? null;

  return { id: channelId, title, avatar, banner, unsubscribedTrailer };
}

export const youtubeKeys = {
  all: ["youtube"] as const,
  tracksInfinite: (query: string, pageSize: number) =>
    ["youtube", "tracks", query, pageSize] as const,
  channel: (id: string) => [...youtubeKeys.all, "channel", id] as const,
};

/**
 * React Query hook to fetch YouTube channel metadata.
 * @param apiKey YouTube Data API key
 * @param channelId YouTube channel ID
 */
export function useYoutubeChannelMeta(apiKey: string, channelId: string) {
  return useQuery<YtChannelMeta, Error>({
    queryKey: youtubeKeys.channel(channelId),
    queryFn: () => fetchChannelMeta(apiKey, channelId),
    enabled: Boolean(channelId), // don't run until we have a valid ID
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
    retry: 2, // retry failed requests
  });
}

export function useYouTubeTracksInfinite(
  query: string,
  pageSize = 24,
  apiKey: string,
) {
  return useInfiniteQuery({
    queryKey: youtubeKeys.tracksInfinite(query, pageSize),
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
