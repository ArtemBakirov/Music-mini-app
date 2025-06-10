import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiInstance from "../utils/axios";
import { Song } from "../types/playList.types";

export const PlaylistDetail = () => {
  const { playlistId } = useParams();
  console.log("playlistId is", playlistId);
  const queryClient = useQueryClient();

  const { data: playlist, isLoading } = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async () => {
      const res = await apiInstance.get(
        `/playlists/single/683d18f57501160e6503c0cd`,
      );
      return res.data;
    },
    enabled: !!playlistId,
  });

  console.log("data playlist is", playlist);

  const removeSongMutation = useMutation({
    mutationFn: (videoId: string) =>
      apiInstance.post(`/playlists/${playlistId}/remove`, { videoId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
    },
  });

  if (isLoading) return <div>Loading playlist...</div>;

  return (
    <div
      className={
        "bg-[#371A4D] h-screen p-4 pt-12 w-full flex flex-col gap-4 items-center"
      }
    >
      <h2 className="text-2xl font-bold mb-4">{playlist.title}</h2>
      <ul className="space-y-4">
        {playlist.songs.map((song: Song) => (
          <li
            key={song.videoId}
            className="bg-[#3E2B50] p-4 rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={song.thumbnailUrl}
                alt={song.title}
                className="w-16 h-16 rounded object-cover"
              />
              <span>{song.title}</span>
            </div>
            <button
              onClick={() => removeSongMutation.mutate(song.videoId)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
