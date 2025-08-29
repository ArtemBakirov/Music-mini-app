// src/hooks/query/jamendo.queries.ts
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { jamendoApiInstance } from "../../utils/axios";

// ---------- Types ----------
export type JamendoTrack = {
  id: string;
  name: string;
  artist_id: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  audio: string; // preview stream
};

export type JamendoAlbum = {
  id: string;
  name: string;
  artist_name?: string;
  image: string;
};

export type JamendoArtist = {
  id: string;
  name: string;
  image: string;
};

export type JamendoPlaylist = {
  id: string;
  name: string;
  image: string;
  user_name?: string;
};

type JamendoResponse<T> = {
  headers: {
    status: "success" | "failed";
    code: number;
    results_count: number;
    warnings?: string;
    error_message?: string;
  };
  results: T[];
};

type JamendoAlbumTracksApiItem = {
  id: number | string;
  name: string;
  artist_name?: string;
  image: string;
  releasedate?: string; // Jamendo sometimes uses `releasedate`
  tracks?: Array<{
    id: number | string;
    name: string;
    artist_id?: number | string;
    artist_name?: string;
    album_name?: string;
    album_image?: string;
    audio?: string;
  }>;
};

export type JamendoAlbumDetails = {
  id: string;
  name: string;
  artist_name?: string;
  image: string;
  release_date?: string;
  tracks: JamendoTrack[];
};

// ---------- Helpers ----------
const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID;

function buildUrl(
  resource: "tracks" | "albums" | "artists" | "playlists",
  params: Record<string, string | number | boolean | undefined>,
) {
  const s = new URLSearchParams();
  s.set("client_id", CLIENT_ID);
  s.set("format", "json");
  if (resource !== "artists") s.set("imagesize", "600");
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) s.set(k, String(v));
  });
  return `${resource}/?${s.toString()}`;
}

async function getJSON<T>(url: string): Promise<T> {
  //console.log("url getJSON", url);
  const res = await jamendoApiInstance.get(url);
  const data = res.data;
  console.log("data getJSON", res);
  if (res.status !== 200) {
    const text = await data.text().catch(() => "");
    throw new Error(
      `Jamendo ${url} failed (${res.status}): ${text || res.statusText}`,
    );
  }
  return data as T;
}

// ---------- Cache Keys ----------
export const jamendoKeys = {
  all: ["jamendo"] as const,
  tracks: (q: string, limit: number) =>
    [...jamendoKeys.all, "tracks", q, limit] as const,
  albums: (q: string, limit: number) =>
    [...jamendoKeys.all, "albums", q, limit] as const,
  artists: (q: string, limit: number) =>
    [...jamendoKeys.all, "artists", q, limit] as const,
  playlists: (q: string, limit: number) =>
    [...jamendoKeys.all, "playlists", q, limit] as const,
};

// ---------- Hooks ----------

/**
 * Infinite list of tracks for a search query.
 * Returns { data, fetchNextPage, hasNextPage, isFetchingNextPage, ... }
 */
export function useJamendoTracksInfinite(query: string, limit = 12) {
  // console.log("got query", query);
  return useInfiniteQuery({
    queryKey: jamendoKeys.tracks(query, limit),
    enabled: Boolean(query?.trim()),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const got = lastPage?.results?.length ?? 0;
      // if we got less than limit, there is no next page
      if (got < limit) return undefined;
      return allPages.length + 1; // next "page" number
    },
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam ?? 1);
      const offset = (page - 1) * limit;

      const url = buildUrl("tracks", {
        search: query,
        limit,
        offset,
        order: "popularity_total",
        include: "musicinfo",
        audioformat: "mp31",
      });
      console.log("getting json", query);
      const json = await getJSON<JamendoResponse<any>>(url);
      // Normalize to JamendoTrack shape (some fields vary)
      console.log("json is in query", json);
      const results: JamendoTrack[] = (json.results || []).map((t: any) => ({
        id: String(t.id),
        name: t.name,
        artist_id: String(t.artist_id ?? ""),
        artist_name: t.artist_name,
        album_name: t.album_name,
        album_image: t.album_image,
        audio: t.audio,
      }));
      return { results, page };
    },
    staleTime: 60_000,
  });
}

/**
 * One-shot list of albums by search.
 */
export function useJamendoAlbums(query: string, limit = 12) {
  return useQuery({
    queryKey: jamendoKeys.albums(query, limit),
    enabled: Boolean(query?.trim()),
    queryFn: async () => {
      const url = buildUrl("albums", {
        search: query,
        limit,
        order: "popularity_total",
      });
      const json = await getJSON<JamendoResponse<any>>(url);
      const results: JamendoAlbum[] = (json.results || []).map((a: any) => ({
        id: String(a.id),
        name: a.name,
        artist_name: a.artist_name,
        image: a.image,
      }));
      return results;
    },
    staleTime: 60_000,
  });
}

/**
 * One-shot list of artists by search.
 */
export function useJamendoArtists(query: string, limit = 12) {
  return useQuery({
    queryKey: jamendoKeys.artists(query, limit),
    enabled: Boolean(query?.trim()),
    queryFn: async () => {
      const url = buildUrl("artists", {
        namesearch: query, // Jamendo prefers `namesearch` for artists
        limit,
        order: "popularity_total",
      });
      const json = await getJSON<JamendoResponse<any>>(url);
      const results: JamendoArtist[] = (json.results || []).map((a: any) => ({
        id: String(a.id),
        name: a.name,
        image: a.image,
      }));
      return results;
    },
    staleTime: 60_000,
  });
}

/**
 * One-shot list of playlists by search.
 */
export function useJamendoPlaylists(query: string, limit = 12) {
  return useQuery({
    queryKey: jamendoKeys.playlists(query, limit),
    enabled: Boolean(query?.trim()),
    queryFn: async () => {
      const url = buildUrl("playlists", {
        search: query,
        limit,
        order: "name",
      });
      const json = await getJSON<JamendoResponse<any>>(url);
      const results: JamendoPlaylist[] = (json.results || []).map((p: any) => ({
        id: String(p.id),
        name: p.name,
        image: p.image,
        user_name: p.user_name,
      }));
      return results;
    },
    staleTime: 60_000,
  });
}

/**
 * Infinite hooks
 */
// --- Infinite Artists ---
export function useJamendoArtistsInfinite(query: string, limit = 24) {
  return useInfiniteQuery({
    queryKey: [...jamendoKeys.artists(query, limit), "infinite"],
    enabled: Boolean(query?.trim()),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const got = lastPage?.results?.length ?? 0;
      return got < limit ? undefined : allPages.length + 1;
    },
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam ?? 1);
      const offset = (page - 1) * limit;

      const url = buildUrl("artists", {
        namesearch: query,
        limit,
        offset,
        order: "popularity_total",
      });

      const json = await getJSON<JamendoResponse<any>>(url);
      const results: JamendoArtist[] = (json.results || []).map((a: any) => ({
        id: String(a.id),
        name: a.name,
        image: a.image,
      }));
      return { results, page };
    },
    staleTime: 60_000,
  });
}

// --- Infinite Albums ---
export function useJamendoAlbumsInfinite(query: string, limit = 24) {
  return useInfiniteQuery({
    queryKey: [...jamendoKeys.albums(query, limit), "infinite"],
    enabled: Boolean(query?.trim()),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const got = lastPage?.results?.length ?? 0;
      return got < limit ? undefined : allPages.length + 1;
    },
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam ?? 1);
      const offset = (page - 1) * limit;

      const url = buildUrl("albums", {
        search: query,
        limit,
        offset,
        order: "popularity_total",
      });

      const json = await getJSON<JamendoResponse<any>>(url);
      const results: JamendoAlbum[] = (json.results || []).map((a: any) => ({
        id: String(a.id),
        name: a.name,
        artist_name: a.artist_name,
        image: a.image,
      }));
      return { results, page };
    },
    staleTime: 60_000,
  });
}

// --- Infinite Playlists ---
export function useJamendoPlaylistsInfinite(query: string, limit = 24) {
  return useInfiniteQuery({
    queryKey: [...jamendoKeys.playlists(query, limit), "infinite"],
    enabled: Boolean(query?.trim()),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const got = lastPage?.results?.length ?? 0;
      return got < limit ? undefined : allPages.length + 1;
    },
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam ?? 1);
      const offset = (page - 1) * limit;

      const url = buildUrl("playlists", {
        search: query,
        limit,
        offset,
        order: "name",
      });

      const json = await getJSON<JamendoResponse<any>>(url);
      const results: JamendoPlaylist[] = (json.results || []).map((p: any) => ({
        id: String(p.id),
        name: p.name,
        image: p.image,
        user_name: p.user_name,
      }));
      return { results, page };
    },
    staleTime: 60_000,
  });
}

/**
 * Tracks from an album.
 */

// Small helper that works with arbitrary path segments (e.g. "albums/tracks")
function buildPath(
  path: string,
  params: Record<string, string | number | boolean | undefined>,
) {
  const s = new URLSearchParams();
  s.set("client_id", CLIENT_ID);
  s.set("format", "json");
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) s.set(k, String(v));
  });
  return `${path}?${s.toString()}`;
}

/**
 * Fetch one album (by Jamendo album id) including its tracks.
 * Jamendo docs: /v3.0/albums/tracks
 */
export function useJamendoAlbum(albumId?: string) {
  return useQuery({
    queryKey: ["jamendo", "album", albumId],
    enabled: Boolean(albumId),
    queryFn: async () => {
      // Request a single album by id with tracks included
      const url = buildPath("albums/tracks", {
        id: albumId,
        imagesize: 600,
        // You can add more params if you want (order, include, etc.)
        // include: "musicinfo",
        // audioformat: "mp31",
        // limit: 1, // (not required; id is unique)
      });

      const json =
        await getJSON<JamendoResponse<JamendoAlbumTracksApiItem>>(url);
      const a = json.results?.[0];
      if (!a) throw new Error("Album not found");

      const tracks: JamendoTrack[] = (a.tracks || []).map((t) => ({
        id: String(t.id),
        name: t.name,
        artist_id: String(t.artist_id ?? ""),
        artist_name: t.artist_name ?? a.artist_name ?? "",
        album_name: t.album_name ?? a.name,
        album_image: t.album_image ?? a.image,
        audio: t.audio ?? "",
      }));

      const details: JamendoAlbumDetails = {
        id: String(a.id),
        name: a.name,
        artist_name: a.artist_name,
        image: a.image,
        release_date: a.releasedate,
        tracks,
      };

      return details;
    },
    staleTime: 60_000,
  });
}
