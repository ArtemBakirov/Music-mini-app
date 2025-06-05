import apiInstance from "../../utils/axios.ts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
