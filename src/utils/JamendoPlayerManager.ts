import { jamendoPlayerStore } from "../hooks/stores/useJamendoPlayerStore";

export class JamendoPlayerManager {
  private static audio: HTMLAudioElement | null = null;
  private static listenersAttached = false;
  private static currentSrc: string | null = null;
  private static unsubStore?: () => void;

  static init(audioEl: HTMLAudioElement) {
    this.audio = audioEl;
    if (!this.listenersAttached) {
      this.attachListeners();
      this.listenersAttached = true;
    }

    // Subscribe once to store changes (currentSong / isPlaying)
    if (!this.unsubStore) {
      let prevSlice = {
        currentSong: jamendoPlayerStore.getState().currentSong,
        isPlaying: jamendoPlayerStore.getState().isPlaying,
      };

      this.unsubStore = jamendoPlayerStore.subscribe((state) => {
        const slice = {
          currentSong: state.currentSong,
          isPlaying: state.isPlaying,
        };

        if (
          slice.currentSong !== prevSlice.currentSong ||
          slice.isPlaying !== prevSlice.isPlaying
        ) {
          void this.syncToState();
        }

        prevSlice = slice;
      });
    }
  }

  private static attachListeners() {
    if (!this.audio) return;
    const set = jamendoPlayerStore.setState;

    this.audio.addEventListener("timeupdate", () => {
      if (!this.audio || !this.audio.duration) return;
      const currentTime = this.audio.currentTime;
      const duration = this.audio.duration;
      const progress = (currentTime / duration) * 100;
      set({ currentTime, progress });
    });

    this.audio.addEventListener("loadedmetadata", () => {
      if (!this.audio) return;
      set({ duration: this.audio.duration });
    });

    this.audio.addEventListener("ended", () => {
      set({
        isPlaying: false,
        progress: 100,
        currentTime: jamendoPlayerStore.getState().duration,
      });
    });
  }

  static async syncToState() {
    const { currentSong, isPlaying } = jamendoPlayerStore.getState();
    if (!this.audio || !currentSong) return;

    if (this.currentSrc !== currentSong.audio) {
      this.audio.src = currentSong.audio;
      this.currentSrc = currentSong.audio;
    }

    if (isPlaying) {
      try {
        await this.audio.play();
      } catch (e) {
        console.warn("audio.play() failed (user gesture?):", e);
      }
    } else {
      this.audio.pause();
    }
  }

  static pause() {
    this.audio?.pause();
    jamendoPlayerStore.setState({ isPlaying: false });
  }

  static resume() {
    if (!this.audio) return;
    this.audio.play()?.catch(() => {});
    jamendoPlayerStore.setState({ isPlaying: true });
  }

  static play(src: string, startAt = 0) {
    if (!this.audio) {
      this.audio = new Audio();
    } else {
      this.audio.pause();
    }

    this.audio.src = src;
    this.audio.currentTime = startAt;
    this.audio.play();
  }

  static seekTo(percent: number) {
    if (!this.audio || !this.audio.duration) return;
    const p = Math.max(0, Math.min(100, percent));
    const t = (p / 100) * this.audio.duration;
    this.audio.currentTime = t;
    jamendoPlayerStore.setState({ currentTime: t, progress: p });
  }

  static getCurrentProgress(): number {
    if (!this.audio) return 0;
    return (this.audio.currentTime / (this.audio.duration || 1)) * 100;
  }

  static onEnded(callback: () => void) {
    this.audio?.addEventListener("ended", callback);
  }
}
