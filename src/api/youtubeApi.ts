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
