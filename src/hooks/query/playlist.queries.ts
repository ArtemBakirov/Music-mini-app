import apiInstance from "../../utils/axios.ts";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Playlist, Song } from "../../types/playList.types";

export const usePlaylists = (ownerId: string) =>
  useQuery<Playlist[]>({
    queryKey: ["playlists", ownerId],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/playlists/${ownerId}`);
      return data;
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
    }) => {
      const { data } = await apiInstance.post(
        `/playlists/${playlistId}/add`,
        song,
      );
      return data;
    },
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
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
