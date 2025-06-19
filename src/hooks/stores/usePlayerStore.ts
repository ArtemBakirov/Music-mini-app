import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {Song} from "../../types/playList.types.ts";

interface PlayerState {
  currentSong: Song | null;
  setCurrentSong: (song: Song) => void;
  clearSong: () => void;

  isPlaying: boolean;
  progress: number;
  // player: YT.Player | null;
  // setPlayer: (player: YT.Player) => void;
  setIsPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;

}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentSong: null,
      setCurrentSong: (song) => set({ currentSong: song }),
      clearSong: () =>  set({ currentSong: null, isPlaying: false, progress: 0, player: null }),

      isPlaying: false,
      progress: 0,
      // player: null,
      // setPlayer: (player) => set({ player }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setProgress: (progress) => set({ progress }),
    }),
    {
      name: "player-store",
      partialize: (state) => ({
        currentSong: state.currentSong,
        isPlaying: state.isPlaying,
        progress: state.progress,
      }),
    }
  )
);
