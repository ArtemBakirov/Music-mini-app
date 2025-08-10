import { createStore } from "zustand";
import { useStore } from "zustand/react";
import { shallow } from "zustand/shallow";
import { persist } from "zustand/middleware";
// import { JamendoSong } from "../../types/playList.types.ts"; // Make sure it matches Jamendo fields

interface PlayerState {
  currentSong: any | null;
  setCurrentSong: (song: any) => void;
  clearSong: () => void;
  duration: number;
  currentTime: number;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  isPlaying: boolean;
  progress: number;
  setIsPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;
}

export const jamendoPlayerStore = createStore<PlayerState>()(
  persist(
    (set) => ({
      currentSong: null,
      currentTime: 0,
      duration: 0,
      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      setCurrentSong: (song) => set({ currentSong: song }),
      clearSong: () =>
        set({ currentSong: null, isPlaying: false, progress: 0 }),

      isPlaying: false,
      progress: 0,
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setProgress: (progress) => set({ progress }),
    }),
    {
      name: "player-store",
      partialize: (state) => ({
        currentSong: state.currentSong,
        isPlaying: state.isPlaying,
        progress: state.progress,
        duration: state.duration,
        currentTime: state.currentTime,
      }),
    },
  ),
);

export const useJamendoPlayerStore = <T>(
  selector?: (state: PlayerState) => T,
  equalityFn?: (a: T, b: T) => boolean,
) => useStore(jamendoPlayerStore, selector, equalityFn);

export const useJamendoPlayerSelector = <T>(
  selector: (state: PlayerState) => T,
) => useJamendoPlayerStore(selector, shallow);
