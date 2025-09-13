import { musicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";
// import { YouTubeProps } from "react-youtube";

export class MusicPlayerManager {
  private static audio: HTMLAudioElement | any | null = null;
  private static listenersAttached = false;
  private static currentSrc: string | null = null;
  private static unsubStore?: () => void;

  static init(audioEl: HTMLAudioElement | any) {
    console.log("init music player manager");
    this.audio = audioEl;
    if (!this.listenersAttached) {
      this.attachListeners();
      this.listenersAttached = true;
    }

    // Subscribe once to store changes (currentSong / isPlaying)
    if (!this.unsubStore) {
      let prevSlice = {
        currentSong: musicPlayerStore.getState().currentSong,
        isPlaying: musicPlayerStore.getState().isPlaying,
      };

      this.unsubStore = musicPlayerStore.subscribe((state) => {
        const slice = {
          currentSong: state.currentSong,
          isPlaying: state.isPlaying,
        };
        console.log("compare slice prevslice", slice, prevSlice);
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
    const { currentSong, provider, isPlaying, setIsPlaying } =
      musicPlayerStore.getState();
    console.log("this currentsong", currentSong, isPlaying);
    if (provider == "youtube") {
      if (!this.audio) return;
      this.audio.onReady = (e: any) => {
        this.audio = e.target; // window.YT.Player
        console.log("onReady", e.target);
        e.target.mute(); // ensure safe autoplay during priming
        const iframe = e.target.getIframe();
        iframe?.setAttribute(
          "allow",
          "autoplay; encrypted-media; picture-in-picture; fullscreen",
        );
        // readyResolveRef.current?.();
        /* setTimeout(() => {
          setIsReady(true);
        }, 2000); */
      };

      this.audio.onStateChange = (e: any) => {
        // Keep a simple "isPlaying" for the custom UI
        const YT = (window as any).YT;
        if (!YT) return;
        if (e.data === YT.PlayerState.PLAYING) setIsPlaying(true);
        if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED)
          setIsPlaying(false);
      };
    } else {
      if (!this.audio) return;
      const set = musicPlayerStore.setState;
      const get = musicPlayerStore.getState();

      this.audio?.addEventListener("timeupdate", () => {
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
          currentTime: musicPlayerStore.getState().duration,
        });
        get.handleEnded();
      });
    }
  }

  static async syncToState() {
    console.log("syncToState");
    const { currentSong, isPlaying, provider } = musicPlayerStore.getState();
    if (!this.audio || !currentSong) return;

    if (provider === "youtube") {
      if (this.currentSrc !== currentSong.audio) {
        //*****************
        // youtube player expects videoId property
        this.audio.videoId = currentSong.audio;
        this.currentSrc = currentSong.audio;
      }

      if (isPlaying) {
        try {
          await this.playYoutube(this.audio);
        } catch (e) {
          console.warn("audio.play() failed (user gesture?):", e);
        }
      } else {
        this.audio.pause();
      }
    } else {
      console.log("not youtube");
      if (this.currentSrc !== currentSong.audio) {
        this.audio.src = currentSong.audio;
        this.currentSrc = currentSong.audio;
      }

      if (isPlaying) {
        console.log("sync to state playing");
        try {
          await this.audio.play();
        } catch (e) {
          console.warn("audio.play() failed (user gesture?):", e);
        }
      } else {
        this.audio.pause();
      }
    }
  }

  static pause() {
    if (this.audio) {
      console.log("this audio", this.audio);
      this.audio?.pause();
      musicPlayerStore.setState({ isPlaying: false });
    } else {
      console.log("no audio");
    }
  }

  static resume() {
    if (!this.audio) return;
    this.audio.play()?.catch(() => {});
    musicPlayerStore.setState({ isPlaying: true });
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
    musicPlayerStore.setState({ currentTime: t, progress: p });
  }

  static getCurrentProgress(): number {
    if (!this.audio) return 0;
    return (this.audio.currentTime / (this.audio.duration || 1)) * 100;
  }

  static onEnded(callback: () => void) {
    this.audio?.addEventListener("ended", callback);
  }

  static async playYoutube(audioEl: any) {
    console.log("play inside MusicPlayerManager", audioEl);
    const p = audioEl.current;
    console.log("play once");
    p.mute(); // safe
    p.playVideo(); // starts muted, allowed
    await new Promise((r) => setTimeout(r, 500)); // brief tick so player actually transitions
    p.unMute();
    p.setVolume(70);
  }
}
