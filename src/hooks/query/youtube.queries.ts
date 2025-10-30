import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { YtSearchVideosPage, YtVideoHit } from "../../api/youtubeApi";
import apiInstance from "../../utils/axios.ts";

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

export type YtChannelHit = {
  id: string; // channelId
  title: string; // channel name
  thumbnail: string;
};

const API_BASE = "https://www.googleapis.com/youtube/v3";

/* global search in YT */

export async function searchYouTubeVideosPaged(
  key: string,
  q: string,
  channelId: string,
  maxResults = 24,
  pageToken?: string,
): Promise<YtSearchVideosPage> {
  const res = await apiInstance.get(`/yt/search/videos`, {
    params: {
      q,
      channelId,
      max: maxResults,
      pageToken,
      key,
    },
  });
  console.log("res videos paged infinite", res);
  /*if (res.statusText !== "OK")
    throw new Error(`YT search (videos) failed: ${res.status}`);*/
  const data = res.data;
  return { items: data.items, nextPageToken: data.nextPageToken };
}

export async function searchYouTubePlaylistsPaged(
  q: string,
  channelId: string,
  key: string,
  maxResults = 24,
  pageToken?: string,
): Promise<YTPage<YtPlaylistHit>> {
  const res = await apiInstance.get(`/yt/search/playlists`, {
    params: {
      q,
      channelId,
      max: maxResults,
      pageToken,
      key,
    },
  });
  console.log("axios res", res);
  /*if (res.statusText !== "OK")
    throw new Error(`YT search (videos) failed: ${res.status}`);*/
  const data = res.data;
  return { items: data.items, nextPageToken: data.nextPageToken };
}

export async function searchYouTubeChannelsPaged(
  q: string,
  key: string,
  maxResults = 24,
  pageToken?: string,
): Promise<YTPage<YtChannelHit>> {
  const res = await apiInstance.get(`/yt/search/channels`, {
    params: {
      q,
      max: maxResults,
      pageToken,
      key,
    },
  });
  console.log("axios res", res);
  /* if (res.statusText !== "OK")
    throw new Error(`YT search (videos) failed: ${res.status}`); */
  const data = res.data;
  return { items: data.items, nextPageToken: data.nextPageToken };
}

/* CHANNEL / ARTIST */

export async function fetchChannelMeta(
  apiKey: string,
  channelId: string,
): Promise<YtChannelMeta> {
  const res = await apiInstance.get(`/yt/channel/${channelId}`, {
    params: {
      key: apiKey,
    },
  });
  /* if (res.statusText !== "OK")
    throw new Error(`YT search (videos) failed: ${res.status}`); */
  const item = res.data;

  if (!item) throw new Error("Channel not found");

  const title = item?.title ?? "Channel";
  const avatar = item.avatar;
  const banner = item.banner;

  const unsubscribedTrailer = item?.unsubscribedTrailer || null;

  return { id: channelId, title, avatar, banner, unsubscribedTrailer };
}

export async function fetchPlaylistMeta(
  apiKey: string,
  playlistId: string,
): Promise<YtPlaylistMeta> {
  const res = await apiInstance.get(`/yt/playlist/${playlistId}`, {
    params: {
      key: apiKey,
    },
  });
  console.log("get metadata res", res);
  /* if (res.statusText !== "OK")
    throw new Error(`YT search (videos) failed: ${res.status}`); */
  const p = res.data;

  if (!p) throw new Error("Playlist not found");

  return res.data;
}

export async function fetchChannelVideos(
  api_key: string,
  channelId: string,
  pageToken?: string,
  maxResults = 24,
): Promise<
  YTPage<{ id: string; title: string; channelTitle: string; thumbnail: string }>
> {
  const res = await apiInstance.get(`/yt/search/videos`, {
    params: {
      key: api_key,
      channelId,
      max: String(maxResults),
      pageToken,
    },
  });
  // console.log("axios res", res);
  /* if (res.statusText !== "OK")
    throw new Error(`YT search (videos) failed: ${res.status}`);*/
  const data = res.data;

  return { items: data.items, nextPageToken: data.nextPageToken };
}

export async function fetchChannelPlaylistsPaged(
  channelId: string,
  apiKey: string,
  maxResults = 24,
  pageToken?: string,
): Promise<YTPage<YtPlaylistHit>> {
  const res = await apiInstance.get(`/yt/search/playlists`, {
    params: {
      key: apiKey,
      channelId,
      max: String(maxResults),
      pageToken,
    },
  });
  // console.log("axios res", res);
  /* if (res.statusText !== "OK")
    throw new Error(`YT search (videos) failed: ${res.status}`); */
  const data = res.data;

  return { items: data.items, nextPageToken: data.nextPageToken };
}

export async function fetchPlaylistItemsPaged(
  playlistId: string,
  apiKey: string,
  maxResults = 25,
  pageToken?: string,
): Promise<YtPlaylistItemsPage> {
  const res = await apiInstance.get(`/yt/playlist/${playlistId}/items`, {
    params: {
      key: apiKey,
      max: String(maxResults),
      pageToken,
    },
  });
  // console.log("axios res", res);
  /* if (res.statusText !== "OK")
    throw new Error(`YT search (videos) failed: ${res.status}`); */
  const data = res.data;

  return { items: data.items, nextPageToken: data.nextPageToken };
}

export const youtubeKeys = {
  all: ["youtube"] as const,
  searchTracks: (q: string, size: number) =>
    [...youtubeKeys.all, "search", "tracks", q, size] as const,
  searchPlaylists: (q: string, size: number) =>
    [...youtubeKeys.all, "search", "playlists", q, size] as const,
  searchChannels: (q: string, size: number) =>
    [...youtubeKeys.all, "search", "channels", q, size] as const,
  channel: (id: string) => [...youtubeKeys.all, "channel", id] as const,
  channelVideosInfinite: (channelId: string, pageSize: number) =>
    ["youtube", "channelVideos", channelId, pageSize] as const,
  channelVideosFirstPage: (channelId: string, pageSize: number) =>
    ["youtube", "channelVideosFirstPage", channelId, pageSize] as const,
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

export function useYouTubeTracksInfinite(
  apiKey: string,
  query: string,
  channelId: string,
  pageSize = 24,
) {
  return useInfiniteQuery({
    queryKey: youtubeKeys.searchTracks(query, pageSize),
    enabled: !!query || !!channelId,
    initialPageParam: undefined as string | undefined, // pageToken
    getNextPageParam: (last) => last.nextPageToken ?? undefined,
    queryFn: async ({ pageParam }) => {
      const page = await searchYouTubeVideosPaged(
        apiKey,
        query,
        channelId,
        pageSize,
        pageParam,
      );
      return page;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useYouTubeTracksFirstPage(
  query: string,
  channelId: string,
  pageSize = 24,
  apiKey: string,
) {
  console.log("useYoutubeTracks", query);
  return useQuery<YTPage<YtVideoHit>, Error>({
    queryKey: youtubeKeys.searchTracks(query, pageSize),
    enabled: Boolean(query),
    queryFn: () => searchYouTubeVideosPaged(apiKey, query, channelId, pageSize),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useYouTubePlaylistsInfinite(
  apiKey: string,
  query: string,
  channelId: string,
  pageSize = 24,
) {
  console.log("use Playlists infinite", query, channelId);
  return useInfiniteQuery<YTPage<YtPlaylistHit>, Error>({
    queryKey: youtubeKeys.searchPlaylists(query, pageSize),
    enabled: Boolean(query) || Boolean(channelId),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextPageToken ?? undefined,
    queryFn: ({ pageParam }) =>
      searchYouTubePlaylistsPaged(
        query,
        channelId,
        apiKey,
        pageSize,
        pageParam,
      ),
    throwOnError: true,
    staleTime: 1000 * 60 * 5,
  });
}

export function useYouTubePlaylistsFirstPage(
  query: string,
  channelId: string,
  pageSize = 24,
  apiKey: string,
) {
  return useQuery<YTPage<YtPlaylistHit>, Error>({
    queryKey: youtubeKeys.searchPlaylists(query, pageSize),
    enabled: Boolean(query),
    queryFn: () =>
      searchYouTubePlaylistsPaged(query, channelId, apiKey, pageSize),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

/* ---------- CHANNELS ---------- */
export function useYouTubeChannelsInfinite(
  query: string,
  pageSize = 24,
  apiKey: string,
) {
  return useInfiniteQuery<YTPage<YtChannelHit>, Error>({
    queryKey: youtubeKeys.searchChannels(query, pageSize),
    enabled: Boolean(query),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextPageToken ?? undefined,
    queryFn: ({ pageParam }) =>
      searchYouTubeChannelsPaged(query, apiKey, pageSize, pageParam),
    staleTime: 1000 * 60 * 5,
  });
}

export function useYouTubeChannelsFirstPage(
  query: string,
  pageSize = 24,
  apiKey: string,
) {
  return useQuery<YTPage<YtChannelHit>, Error>({
    queryKey: youtubeKeys.searchChannels(query, pageSize),
    enabled: Boolean(query),
    queryFn: () => searchYouTubeChannelsPaged(query, apiKey, pageSize),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
