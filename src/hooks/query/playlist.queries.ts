import apiInstance from "../../utils/axios.ts";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Playlist, Song } from "../../types/playList.types";

const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID;

export const usePlaylists = (ownerId: string) =>
  useQuery<Playlist[]>({
    queryKey: ["playlists", ownerId],
    queryFn: async () => {
      // const { data } = await apiInstance.get(`/playlists/${ownerId}`);
      // add later real user id from bastyon
      return [];
    },
  });

export const useAddSongToPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playlistId,
      song,
    }: {
      playlistId: string;
      song: Song;
      ownerId: string;
    }) => {
      const { data } = await apiInstance.post(
        `/playlists/${playlistId}/add`,
        song,
      );
      return data;
    },
    onSuccess: (_, { playlistId, ownerId }) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      queryClient.invalidateQueries({ queryKey: ["allSongIds", ownerId] });
    },
  });
};

export const useAllUserSongIds = (ownerId: string) =>
  useQuery<string[]>({
    queryKey: ["allSongIds", ownerId],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/playlists/allSongs/${ownerId}`);
      return data;
    },
  });

export const usePlaylistById = (playlistId: string) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async () => {
      const res = await apiInstance.get(`/playlists/single/${playlistId}`);
      return res.data;
    },
  });
};

export const usePlaylistSongs = (playlistId: string | null) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async () => {
      const res = await apiInstance.get(
        `/playlists/single/683d18f57501160e6503c0cd`,
      );
      return res.data;
    },
    enabled: !!playlistId,
  });
};

// infinite scroll query for playlists

export const useInfiniteYoutubeSearch = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["youtube-search", query],
    queryFn: async ({ pageParam = "" }) => {
      const res = await apiInstance.get(
        `/music/youtubeSearch?q=${encodeURIComponent(query)}&nextPageToken=${pageParam}`,
      );
      console.log("data is", res.data);
      return res.data; // Must include both items and nextPageToken
    },
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    initialPageParam: "",
    enabled: !!query, // avoid firing when query is empty
  });
};

export const useInfiniteJamendoSearch = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["jamendo", query],
    enabled: !!query,
    getNextPageParam: (lastPage) => {
      if (lastPage?.headers?.total >= lastPage?.meta?.next_start) {
        return lastPage?.meta?.next_start;
      }
      return undefined;
    },
    initialPageParam: "",
    queryFn: async ({ pageParam = 0 }) => {
      const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&fuzzytags=${query}&offset=${pageParam}`;
      const res = await fetch(url);
      const json = await res.json();
      return {
        items: json.results,
        meta: { next_start: pageParam + 10 },
        headers: {
          total: json.headers.results_count,
        },
      };
    },
  });
};
