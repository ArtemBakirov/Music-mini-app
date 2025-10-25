import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { YtSearchVideosPage, YtVideoHit } from "../../api/youtubeApi";

export type YtChannelMeta = {
  id: string;
  title: string;
  avatar: string | null;
  banner: string | null;
  unsubscribedTrailer: string | null;
};

export type YtChannelVideo = {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
};

export type YTPage<T> = {
  items: T[];
  nextPageToken?: string;
};

export type YtPlaylistHit = {
  id: string; // playlistId
  title: string;
  channelTitle: string;
  thumbnail: string;
};

export interface YtPlaylistItem {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
}

export interface YtPlaylistItemsPage {
  items: YtPlaylistItem[];
  nextPageToken?: string;
}

export interface YtPlaylistMeta {
  id: string;
  title: string;
  description: string | null;
  channelId: string;
  channelTitle: string;
  publishedAt: string; // ISO
  itemCount: number;
  thumbnails: {
    default?: string;
    medium?: string;
    high?: string;
    standard?: string;
    maxres?: string;
  };
}

const API_BASE = "https://www.googleapis.com/youtube/v3";

export async function searchYouTubeVideosPaged(
  q: string,
  key: string,
  maxResults = 24,
  pageToken?: string,
): Promise<YtSearchVideosPage> {
  const url = new URL(`${API_BASE}/search`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", q);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(maxResults));
  if (pageToken) url.searchParams.set("pageToken", pageToken);
  url.searchParams.set("key", key);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`YT search (videos) failed: ${res.status}`);
  const json = await res.json();

  const items: YtVideoHit[] = (json.items ?? []).map((it: any) => {
    const s = it.snippet;
    const id = it.id?.videoId;
    return {
      id,
      title: s.title,
      channelTitle: s.channelTitle,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    } as YtVideoHit;
  });

  return { items, nextPageToken: json.nextPageToken };
}

/* CHANNEL / ARTIST */

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

export async function fetchPlaylistMeta(
  apiKey: string,
  playlistId: string,
): Promise<YtPlaylistMeta> {
  const url = new URL("https://www.googleapis.com/youtube/v3/playlists");
  url.searchParams.set("part", "snippet,contentDetails,status,player");
  url.searchParams.set("id", playlistId);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to load playlist meta (${res.status})`);
  const json = await res.json();

  const p = json.items?.[0];
  if (!p) throw new Error("Playlist not found");

  const s = p.snippet ?? {};
  const t = s.thumbnails ?? {};

  return {
    id: p.id,
    title: s.title ?? "Playlist",
    description: s.description ?? null,
    channelId: s.channelId ?? "",
    channelTitle: s.channelTitle ?? "",
    publishedAt: s.publishedAt ?? "",
    itemCount: p.contentDetails?.itemCount ?? 0,
    thumbnails: {
      default: t.default?.url,
      medium: t.medium?.url,
      high: t.high?.url,
      standard: t.standard?.url,
      maxres: t.maxres?.url,
    },
  };
}

export async function fetchChannelVideos(
  api_key: string,
  channelId: string,
  pageToken?: string,
  maxResults = 24,
): Promise<
  YTPage<{ id: string; title: string; channelTitle: string; thumbnail: string }>
> {
  const params = new URLSearchParams({
    key: api_key,
    part: "snippet",
    type: "video",
    channelId,
    order: "date", // or "viewCount" / "relevance"
    maxResults: String(maxResults),
  });
  if (pageToken) params.set("pageToken", pageToken);

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params}`,
  );
  console.log("channels tracks fetch res", res);
  if (!res.ok) throw new Error("YouTube channel videos fetch failed");
  const json = await res.json();

  const items = (json.items ?? []).map((it: any) => ({
    id: it.id.videoId,
    title: it.snippet.title,
    channelTitle: it.snippet.channelTitle,
    thumbnail:
      it.snippet.thumbnails?.medium?.url ||
      it.snippet.thumbnails?.default?.url ||
      "",
  }));

  return { items, nextPageToken: json.nextPageToken };
}

export async function fetchChannelPlaylistsPaged(
  channelId: string,
  apiKey: string,
  maxResults = 24,
  pageToken?: string,
): Promise<YTPage<YtPlaylistHit>> {
  console.log("query function");
  const url = new URL(`${API_BASE}/playlists`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("channelId", channelId);
  url.searchParams.set("maxResults", String(maxResults));
  if (pageToken) url.searchParams.set("pageToken", pageToken);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  console.log("fetch channel playlists res", res);
  if (!res.ok) throw new Error(`YT channel playlists failed: ${res.status}`);
  const json = await res.json();

  const items: YtPlaylistHit[] = (json.items ?? []).map((it: any) => {
    const s = it.snippet;
    const id = it.id;
    const thumb =
      s?.thumbnails?.high?.url ||
      s?.thumbnails?.medium?.url ||
      s?.thumbnails?.default?.url ||
      "";
    return {
      id,
      title: s?.title ?? "Playlist",
      channelTitle: s?.channelTitle ?? "",
      thumbnail: thumb,
    };
  });

  return { items, nextPageToken: json.nextPageToken };
}

export async function fetchPlaylistItemsPaged(
  playlistId: string,
  apiKey: string,
  maxResults = 25,
  pageToken?: string,
): Promise<YtPlaylistItemsPage> {
  const url = new URL(`${API_BASE}/playlistItems`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("key", apiKey);
  if (pageToken) url.searchParams.set("pageToken", pageToken);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`YT playlistItems failed: ${res.status}`);
  const json = await res.json();

  const items: YtPlaylistItem[] = (json.items ?? [])
    .map((it: any) => {
      const s = it.snippet;
      const videoId = s?.resourceId?.videoId;
      if (!videoId) return null;
      return {
        videoId,
        title: s.title,
        channelTitle: s.channelTitle,
        thumbnail:
          s.thumbnails?.high?.url ??
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    })
    .filter(Boolean);

  return { items, nextPageToken: json.nextPageToken };
}

export const youtubeKeys = {
  all: ["youtube"] as const,
  tracksInfinite: (query: string, pageSize: number) =>
    ["youtube", "tracks", query, pageSize] as const,
  channel: (id: string) => [...youtubeKeys.all, "channel", id] as const,
  channelVideosInfinite: (channelId: string, pageSize: number) =>
    ["youtube", "channelVideos", channelId, pageSize] as const,
  channelVideosFirstPage: (channelId: string, pageSize: number) =>
    ["youtube", "channelVideosFirstPage", channelId, pageSize] as const,
  playlistsInfinite: (query: string, pageSize: number) =>
    ["youtube", "playlists", query, pageSize] as const,
  channelPlaylistsInfinite: (channelId: string, pageSize: number) =>
    ["youtube", "channelPlaylists", channelId, pageSize] as const,
  playlistItemsInfinite: (playlistId: string, pageSize: number) =>
    ["youtube", "playlistItemsInfinite", playlistId, pageSize] as const,
  playlistMeta: (playlistId: string) =>
    ["youtube", "playlistMeta", playlistId] as const,
};

export function useYoutubeChannelVideosInfinite(
  apiKey: string,
  channelId: string,
  pageSize = 24,
) {
  return useInfiniteQuery<YTPage<YtChannelVideo>, Error>({
    queryKey: youtubeKeys.channelVideosInfinite(channelId, pageSize),
    enabled: Boolean(channelId),
    initialPageParam: undefined as string | undefined, // pageToken
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    queryFn: ({ pageParam }) =>
      fetchChannelVideos(apiKey, channelId, pageParam, pageSize),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

// --- Optional: just the first page (non-infinite) ---
export function useYoutubeChannelVideosFirstPage(
  apiKey: string,
  channelId: string,
  pageSize = 24,
) {
  return useQuery<YTPage<YtChannelVideo>, Error>({
    queryKey: youtubeKeys.channelVideosFirstPage(channelId, pageSize),
    enabled: Boolean(channelId),
    queryFn: () => fetchChannelVideos(apiKey, channelId, undefined, pageSize),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useYoutubeChannelPlaylistsFirstPage(
  apiKey: string,
  channelId: string,
  pageSize = 12,
) {
  return useQuery<YTPage<YtPlaylistHit>, Error>({
    queryKey: ["youtube", "channelPlaylistsFirstPage", channelId, pageSize],
    enabled: Boolean(channelId),
    queryFn: () => fetchChannelPlaylistsPaged(channelId, apiKey, pageSize),
    staleTime: 1000 * 60 * 5, // cache for 5 min
    retry: 2, // retry failed requests twice
  });
}

export function useYouTubeChannelPlaylistsInfinite(
  apiKey: string,
  channelId: string,
  pageSize = 24,
) {
  console.log(
    "useYouTubeChannelPlaylistsInfinite",
    apiKey,
    channelId,
    pageSize,
  );
  return useInfiniteQuery({
    queryKey: youtubeKeys.channelPlaylistsInfinite(channelId, pageSize),
    enabled: !!channelId,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextPageToken ?? undefined,
    queryFn: ({ pageParam }) =>
      fetchChannelPlaylistsPaged(channelId, apiKey, pageSize, pageParam),
    staleTime: 1000 * 60 * 5,
  });
}

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

export function useYoutubePlaylistMeta(apiKey: string, playlistId: string) {
  return useQuery<YtPlaylistMeta, Error>({
    queryKey: youtubeKeys.playlistMeta(playlistId),
    enabled: Boolean(apiKey && playlistId),
    queryFn: () => fetchPlaylistMeta(apiKey, playlistId),
    staleTime: 1000 * 60 * 10,
    retry: 2,
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

export function useYoutubePlaylistItemsInfinite(
  apiKey: string,
  playlistId: string,
  pageSize = 25,
) {
  return useInfiniteQuery<YtPlaylistItemsPage, Error>({
    queryKey: youtubeKeys.playlistItemsInfinite(playlistId, pageSize),
    enabled: Boolean(apiKey && playlistId),
    initialPageParam: undefined as string | undefined, // pageToken
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    queryFn: ({ pageParam }) =>
      fetchPlaylistItemsPaged(playlistId, apiKey, pageSize, pageParam),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
