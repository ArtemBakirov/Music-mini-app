import { createStore } from "zustand";
import { useStore } from "zustand/react";
import { shallow } from "zustand/shallow";
import { persist } from "zustand/middleware";
// import { JamendoSong } from "../../types/playList.types.ts"; // Make sure it matches Jamendo fields

export type RepeatMode = "off" | "one" | "all";

interface PlayerState {
  // playback
  currentSong: any | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  progress: number;

  // queue
  queue: Array<any>;
  currentIndex: number;
  isShuffling: boolean;
  repeatMode: RepeatMode;

  // setters
  setCurrentSong: (song: any) => void;
  setIsPlaying: (playing: boolean) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setProgress: (progress: number) => void;

  // queue ops
  setQueue: (tracks: Array<any>) => void;
  playAt: (index: number) => void;
  next: () => void;
  prev: () => void;
  handleEnded: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;

  clearSong: () => void;
}

export const jamendoPlayerStore = createStore<PlayerState>()(
  persist(
    (set, get) => ({
      currentSong: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      progress: 0,

      queue: [],
      currentIndex: -1,
      isShuffling: false,
      repeatMode: "off",

      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      setCurrentSong: (song) => set({ currentSong: song }),

      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setProgress: (progress) => set({ progress }),

      setQueue: (tracks) => {
        // keep current if still present; otherwise reset selection
        const { currentSong } = get();
        let currentIndex = -1;
        if (currentSong) {
          currentIndex = tracks.findIndex((t) => t.id === currentSong.id);
        }
        set({
          queue: tracks,
          currentIndex,
          // do not change currentSong unless we lost it
          ...(currentIndex === -1
            ? { currentSong: null, isPlaying: false }
            : {}),
        });
      },
      playAt: (index) => {
        const { queue } = get();
        if (index < 0 || index >= queue.length) return;
        set({
          currentIndex: index,
          currentSong: queue[index],
          isPlaying: true,
        });
      },
      next: () => {
        const { queue, currentIndex, isShuffling, repeatMode } = get();
        if (!queue.length) return;

        // repeat one -> stay on same index
        if (repeatMode === "one") {
          set({ isPlaying: true }); // just continue
          return;
        }

        if (isShuffling) {
          // pick a random different index
          let nextIdx = currentIndex;
          if (queue.length > 1) {
            while (nextIdx === currentIndex) {
              nextIdx = Math.floor(Math.random() * queue.length);
            }
          }
          get().playAt(nextIdx);
          return;
        }

        const lastIndex = queue.length - 1;
        if (currentIndex < lastIndex) {
          get().playAt(currentIndex + 1);
        } else {
          // at end
          if (repeatMode === "all") {
            get().playAt(0);
          } else {
            // repeat off -> stop
            set({ isPlaying: false });
          }
        }
      },
      prev: () => {
        const { queue, currentIndex, isShuffling } = get();
        if (!queue.length) return;

        if (isShuffling) {
          if (queue.length > 1) {
            let prevIdx = currentIndex;
            while (prevIdx === currentIndex) {
              prevIdx = Math.floor(Math.random() * queue.length);
            }
            get().playAt(prevIdx);
          }
          return;
        }

        if (currentIndex > 0) {
          get().playAt(currentIndex - 1);
        } else {
          // wrap to end (common UX) — change if you prefer no-wrap
          get().playAt(queue.length - 1);
        }
      },

      handleEnded: () => {
        get().next();
      },

      toggleShuffle: () => {
        set({ isShuffling: !get().isShuffling });
      },

      cycleRepeat: () => {
        const order: RepeatMode[] = ["off", "one", "all"];
        const i = order.indexOf(get().repeatMode);
        set({ repeatMode: order[(i + 1) % order.length] });
      },
      clearSong: () =>
        set({ currentSong: null, isPlaying: false, progress: 0 }),
    }),
    {
      name: "player-store",
      partialize: (state) => ({
        currentSong: state.currentSong,
        isPlaying: state.isPlaying,
        queue: state.queue,
        currentIndex: state.currentIndex,
        isShuffling: state.isShuffling,
        repeatMode: state.repeatMode,
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
