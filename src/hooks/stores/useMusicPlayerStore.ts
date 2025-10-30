import { createStore } from "zustand";
import { useStore } from "zustand/react";
import { shallow } from "zustand/shallow";
import { persist } from "zustand/middleware";
import { MusicPlayerManager } from "../../utils/MusicPlayerManager.ts";
// import { JamendoSong } from "../../types/playList.types.ts"; // Make sure it matches Jamendo fields
import { Song } from "../../types/youtube.types.ts";

/* export type Song = {
  id?: string;
  name: string;
  artist_id?: string;
  artist_name?: string;
  album_name?: string;
  album_image: string;
  audio: string;
};*/

export type RepeatMode = "off" | "one" | "all";
export type Provider = "youtube" | "jamendo" | null;

interface PlayerState {
  // playback
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  progress: number;
  provider: Provider;

  // queue
  queue: Array<Song>;
  currentIndex: number;
  isShuffling: boolean;
  repeatMode: RepeatMode;

  // setters
  setCurrentSong: (song: Song) => void;
  setIsPlaying: (playing: boolean) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setProgress: (progress: number) => void;
  setProvider: (provider: Provider) => void;

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

export const musicPlayerStore = createStore<PlayerState>()(
  persist(
    (set, get) => ({
      currentSong: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      provider: null,

      queue: [],
      currentIndex: -1,
      isShuffling: false,
      repeatMode: "off",

      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      setCurrentSong: (song) => {
        console.log("set current song", song);
        set({
          currentSong: song,
        });
      },
      setProvider: (provider) => {
        // console.log("set provider playerStore", provider);
        set({ provider });
      },

      setIsPlaying: (isPlaying) => {
        // console.log("set isPlaying Store");
        set({ isPlaying });
      },
      setProgress: (progress) => set({ progress }),

      setQueue: (tracks) => {
        //console.log("setting queue, tracks", tracks);
        // keep current if still present; otherwise reset selection
        const { currentSong } = get();
        // console.log("setting queue, currentSong", currentSong);
        let currentIndex = -1;
        if (currentSong) {
          // console.log("setting currentIndex", currentSong, tracks);
          currentIndex = tracks.findIndex(
            (t) => t.audioId === currentSong.audioId,
          );
          // console.log("current index found", currentIndex);
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
        // console.log("playAt", index);
        const { queue, provider } = get();
        if (index < 0 || index >= queue.length) return;
        // console.log("queue", queue);
        // console.log("new currentSong", queue[index]);
        const { title, thumbnail, audioId, channelTitle } = queue[index];
        const song = queue[index];
        // MusicPlayerManager.pause();
        // console.log("set...");
        if (provider === "youtube") {
          set({
            currentIndex: index,
            currentSong: {
              title,
              thumbnail,
              audioId,
              channelTitle,
            },
            isPlaying: true,
          });
        } else {
          set({
            currentIndex: index,
            currentSong: song,
            isPlaying: true,
          });
        }

        // set({ isPlaying: true });
        // MusicPlayerManager.resume();
        /* set({
          currentIndex: index,
          currentSong: {
            name: title,
            album_image: thumbnail,
            audio: id,
          },
          isPlaying: true,
        }); */
      },
      next: () => {
        // console.log("next");
        const { queue, currentIndex, isShuffling, repeatMode } = get();
        // console.log("next, currentIndex", currentIndex);
        // console.log("queue", queue);
        if (!queue.length) return;

        // repeat one -> stay on same index
        // when repeatMode is "one", should only stay at the same index when the song is ended, but not if
        // the user clicks "next" or "prev"

        if (isShuffling) {
          // console.log("is shuffling");
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
        // console.log("lastIndex", lastIndex);
        if (currentIndex < lastIndex) {
          // console.log("next index play");
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
        // when a song ends and repeatMode is "one" - then just repeat the song.
        const { repeatMode } = get();
        if (repeatMode === "one") {
          set({ isPlaying: true }); // just continue
          return;
        }
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
        provider: state.provider,
      }),
    },
  ),
);

export const useMusicPlayerStore = <T>(
  selector?: (state: PlayerState) => T,
  equalityFn?: (a: T, b: T) => boolean,
) => useStore(musicPlayerStore, selector, equalityFn);

export const useJamendoPlayerSelector = <T>(
  selector: (state: PlayerState) => T,
) => useMusicPlayerStore(selector, shallow);
