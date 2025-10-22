// src/api/library.ts
import apiInstance from "../../utils/axios.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Song } from "../../types/youtube.types.ts";

export type LibraryKind = "track" | "album" | "artist";
export type Provider = "youtube" | "jamendo";

export type Snapshot = {
  title: string;
  subtitle?: string;
  thumbnail: string;
  extra?: any;
};

export async function addToLibrary(input: {
  address: string;
  kind: LibraryKind;
  provider: Provider;
  song?: Song;
  channelId?: string;
  playlistId?: string;
}) {
  console.log("adding input", input);
  const { data } = await apiInstance.post("/library", input);
  return data;
}

export async function removeFromLibrary(params: {
  address: string;
  kind: LibraryKind;
  provider: Provider;
  audioId?: string;
  channelId?: string;
  playlistId?: string;
}) {
  const { data } = await apiInstance.delete("/library", { params });
  return data;
}

export async function listLibrary(
  address: string,
  kind?: LibraryKind,
  page = 1,
  limit = 30,
) {
  const { data } = await apiInstance.get("/library", {
    params: { address, kind, page, limit },
  });
  return data as {
    items: any[];
    page: number;
    total: number;
    hasNextPage: boolean;
  };
}

export async function isSavedBatch(input: {
  address: string;
  kind: LibraryKind;
  provider: Provider;
  ids: string[];
}) {
  const { data } = await apiInstance.post("/library/is-saved", input);
  return data as Record<string, boolean>; // id -> saved
}

export const libraryKeys = {
  all: ["library"] as const,
  kind: (k: string) => [...libraryKeys.all, k] as const,
  savedMap: (k: string, ids: string[]) =>
    [...libraryKeys.all, "saved", k, ids.sort().join(",")] as const,
};

export function useLibrary(
  address: string,
  kind?: "track" | "album" | "artist",
  page = 1,
  limit = 30,
) {
  return useQuery({
    queryKey: libraryKeys.kind(kind ?? "all"),
    queryFn: () => listLibrary(address, kind, page, limit),
    staleTime: 30_000,
  });
}

export function useSavedMap(
  address: string,
  kind: "track" | "album" | "artist",
  ids: string[],
) {
  return useQuery({
    enabled: ids.length > 0,
    queryKey: libraryKeys.savedMap(kind, ids),
    queryFn: () => isSavedBatch({ address, kind, provider: "youtube", ids }),
    staleTime: 30_000,
  });
}

export function useToggleSave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      address: string;
      action: "add" | "remove";
      kind: "track" | "album" | "artist";
      song?: Song;
      channelId?: string;
      playlistId?: string;
    }) => {
      if (p.action === "add") {
        return addToLibrary({
          address: p.address,
          kind: p.kind,
          provider: "youtube",
          song: p.song,
          channelId: p.channelId,
          playlistId: p.playlistId,
        });
      } else {
        return removeFromLibrary({
          address: p.address,
          kind: p.kind,
          provider: "youtube",
          audioId: p?.song?.audioId,
          channelId: p.channelId,
          playlistId: p.playlistId,
        });
      }
    },
    onSuccess: () => {
      // Invalidate lists and saved maps
      qc.invalidateQueries({ queryKey: libraryKeys.all });
    },
  });
}
