import { create } from 'zustand';
import { Playlist } from '../../types/playList.types.ts';

interface PlaylistState {
  playlists: Playlist[];
  addPlaylist: (playlist: Playlist) => void;
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  playlists: [],
  addPlaylist: (playlist) =>
    set((state) => ({
      playlists: [...state.playlists, playlist],
    })),
}));
