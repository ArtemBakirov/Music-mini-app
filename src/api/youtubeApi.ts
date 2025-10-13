// Minimal YouTube Data API helpers (client-side).
// NOTE: Client-side keys are visible; prefer a proxy in production.
// For now we follow your approach and keep it simple.

const API_BASE = "https://www.googleapis.com/youtube/v3";

export type YtSearchItem =
  | ({ id: { kind: "youtube#video"; videoId: string } } & { snippet: any })
  | ({ id: { kind: "youtube#playlist"; playlistId: string } } & {
      snippet: any;
    })
  | ({ id: { kind: "youtube#channel"; channelId: string } } & { snippet: any });

export type YTPage<T> = { items: T[]; nextPageToken?: string };

export type YtVideoHit = {
  id: string; // videoId
  title: string;
  channelTitle: string;
  thumbnail: string;
};

export type YtPlaylistHit = {
  id: string; // playlistId
  title: string;
  channelTitle: string;
  thumbnail: string;
};

export type YtChannelHit = {
  id: string; // channelId
  title: string;
  thumbnail: string;
};

export async function searchYouTubeAll(
  q: string,
  key: string,
  maxResults = 12,
): Promise<{
  videos: YtVideoHit[];
  playlists: YtPlaylistHit[];
  channels: YtChannelHit[];
}> {
  const url = new URL(`${API_BASE}/search`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", q);
  url.searchParams.set("type", "video,playlist,channel");
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("key", key);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`YT search failed: ${res.status}`);
  const json = await res.json();

  const videos: YtVideoHit[] = [];
  const playlists: YtPlaylistHit[] = [];
  const channels: YtChannelHit[] = [];

  (json.items as YtSearchItem[]).forEach((it) => {
    const s = it.snippet;
    if ("videoId" in it.id) {
      videos.push({
        id: it.id.videoId,
        title: s.title,
        channelTitle: s.channelTitle,
        thumbnail: `https://i.ytimg.com/vi/${it.id.videoId}/hqdefault.jpg`,
      });
    } else if ("playlistId" in it.id) {
      playlists.push({
        id: it.id.playlistId,
        title: s.title,
        channelTitle: s.channelTitle,
        thumbnail: s.thumbnails?.high?.url ?? s.thumbnails?.default?.url,
      });
    } else if ("channelId" in it.id) {
      channels.push({
        id: it.id.channelId,
        title: s.channelTitle || s.title,
        thumbnail: s.thumbnails?.high?.url ?? s.thumbnails?.default?.url,
      });
    }
  });

  return { videos, playlists, channels };
}

export type YtPlaylistItem = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
};

export async function fetchPlaylistItems(
  playlistId: string,
  key: string,
  maxResults = 25,
): Promise<YtPlaylistItem[]> {
  const url = new URL(`${API_BASE}/playlistItems`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("key", key);

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

  return items;
}

export type YtSearchVideosPage = {
  items: YtVideoHit[];
  nextPageToken?: string;
};

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

// ---- Search CHANNELS (Artists) ----
export async function fetchYouTubeChannels(
  key: string,
  query: string,
  pageToken?: string,
  maxResults = 24,
): Promise<YTPage<{ id: string; title: string; thumbnail: string }>> {
  const params = new URLSearchParams({
    key: key,
    part: "snippet",
    type: "channel",
    q: query,
    maxResults: String(maxResults),
  });
  if (pageToken) params.set("pageToken", pageToken);

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params}`,
  );

  console.log("res fetch channels", res);
  if (!res.ok) throw new Error("YouTube channel search failed");
  const json = await res.json();

  const items = (json.items ?? []).map((it: any) => ({
    id: it.id.channelId,
    title: it.snippet.title,
    thumbnail:
      it.snippet.thumbnails?.medium?.url ||
      it.snippet.thumbnails?.default?.url ||
      "",
  }));

  return { items, nextPageToken: json.nextPageToken };
}

// ---- Videos by CHANNEL ----
// NOTE: `search` gives lightweight video list; if you need durations, call /videos by ids after.
export async function fetchChannelVideos(
  key: string,
  channelId: string,
  pageToken?: string,
  maxResults = 24,
): Promise<
  YTPage<{ id: string; title: string; channelTitle: string; thumbnail: string }>
> {
  const params = new URLSearchParams({
    key: key,
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
