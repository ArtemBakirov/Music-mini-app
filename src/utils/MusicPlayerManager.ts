import { musicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";
// import { YouTubeProps } from "react-youtube";

export class MusicPlayerManager {
  private static audio: HTMLAudioElement | any | null = null;
  private static listenersAttached = false;
  private static currentSrc: string | null = null;
  private static newSrc: string | null = null;
  private static unsubStore?: () => void;
  private static progressTimer: any | null = null;

  static init(audioEl: HTMLAudioElement | any) {
    console.log("init");
    const { provider } = musicPlayerStore.getState();
    if (provider === "youtube") {
      if (!audioEl) return;
      this.audio = audioEl; // window.YT.Player
      audioEl.mute(); // ensure safe autoplay during priming
      const iframe = audioEl.getIframe();
      iframe?.setAttribute(
        "allow",
        "autoplay; encrypted-media; picture-in-picture; fullscreen",
      );
      // readyResolveRef.current?.();
    }

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

        if (
          slice.currentSong !== prevSlice.currentSong ||
          slice.isPlaying !== prevSlice.isPlaying
        ) {
          void this.syncToState();
        }

        prevSlice = slice;
      });
    }
    // on first init, the subscriber will not be called, so we need to sync manually
    void this.syncToState();
  }

  private static attachListeners() {
    if (!this.audio) return;
    const { provider } = musicPlayerStore.getState();
    const set = musicPlayerStore.setState;
    const get = musicPlayerStore.getState();
    if (provider === "youtube") {
      // --- YOUTUBE ---
      const player = this.audio;
      // Polling loop for progress
      const updateProgress = () => {
        if (!player || typeof player.getCurrentTime !== "function") return;
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        if (duration > 0) {
          const progress = (currentTime / duration) * 100;
          set({ currentTime, duration, progress });
        }
      };

      // Start polling when video is playing, stop when paused/ended
      player.addEventListener("onStateChange", (e: any) => {
        const YT = (window as any).YT;
        if (!YT) return;

        if (e.data === YT.PlayerState.PLAYING) {
          this.progressTimer = setInterval(updateProgress, 1000);
        } else {
          clearInterval(this.progressTimer);
          this.progressTimer = null;

          if (e.data === YT.PlayerState.ENDED) {
            set({
              isPlaying: false,
              progress: 100,
              currentTime: player.getDuration(),
            });
            get.handleEnded();
          }
        }
      });
    } else {
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
    const { currentSong, isPlaying, provider, repeatMode } =
      musicPlayerStore.getState();
    if (!this.audio || !currentSong) return;

    if (provider === "youtube") {
      /* console.log(
        "this current, currentSong audio",
        this.currentSrc,
        currentSong.audio,
      );*/
      // console.log("src data", this.currentSrc, currentSong.audio, currentSong);
      if (this.currentSrc !== currentSong.audio || repeatMode === "one") {
        // console.log("change src", this.currentSrc, currentSong.audio);
        //*****************
        console.log("sync youtube");
        // youtube player expects videoId property
        // console.log("setting videoId", currentSong.audio);
        this.audio.videoId = currentSong.audio;
        this.currentSrc = currentSong.audio;
        // console.log("set videoId", this.audio);
        if (this.audio) {
          // console.log("sync this audio exists", this.audio);
          // console.log("isPlaying", isPlaying);
          if (isPlaying) {
            // console.log("sync is playing true");
            if (!this.audio.videoId) return;
            // console.log("isPlaying, trying to play", this.audio.videoId);
            try {
              // console.log("cueing video");

              this.audio.cueVideoById({ videoId: this.audio.videoId });
              setTimeout(async () => {
                console.log("EXECUTING YOUTUBE");
                await this.playYoutube(this.audio);
              }, 1500);
            } catch (e) {
              console.warn("audio.play() failed (user gesture?):", e);
            }
          } else {
            // console.log("audio is", this.audio);
            this.audio.pauseVideo();
          }
        } else {
          // console.log("no audio");
        }
      }

      // console.log("this audio in sync", this.audio);
    } else {
      if (this.currentSrc !== currentSong.audio) {
        this.audio.src = currentSong.audio;
        this.currentSrc = currentSong.audio;
      }

      if (isPlaying) {
        // console.log("sync to state playing");
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
    const { provider } = musicPlayerStore.getState();
    if (this.audio) {
      if (provider === "youtube") {
        // console.log("this audio", this.audio);
        this.audio?.pauseVideo();
      } else {
        // console.log("this audio", this.audio);
        this.audio?.pause();
      }
      // musicPlayerStore.setState({ isPlaying: false });
    } else {
      console.log("no audio");
    }
  }

  static async resume() {
    if (!this.audio) return;
    const { provider } = musicPlayerStore.getState();
    if (provider === "youtube") {
      // not sure why I add this, maybe don't need to call playVideo here
      try {
        const p = this.audio;
        p.mute(); // safe
        // console.log("did mute");
        p.playVideo(); // starts muted, allowed
        await new Promise((r) => setTimeout(r, 500)); // brief tick so player actually transitions
        p.unMute();
        p.setVolume(70);
      } catch (e) {
        console.log("play video failed", e);
      }
    } else {
      this.audio.play()?.catch(() => {});
    }
    // console.log("resume");
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
    if (!this.audio) return;

    const { provider } = musicPlayerStore.getState();
    // clamp 0..100
    const p = Math.max(0, Math.min(100, percent));

    if (provider === "youtube") {
      // YT: use getDuration/getCurrentTime + seekTo(seconds, allowSeekAhead)
      const dur =
        typeof this.audio.getDuration === "function"
          ? this.audio.getDuration()
          : 0;
      if (!dur || !isFinite(dur)) return; // not ready yet
      const t = (p / 100) * dur;
      this.audio.seekTo(t, /* allowSeekAhead */ true);
      musicPlayerStore.setState({ currentTime: t, duration: dur, progress: p });
    } else {
      if (!this.audio || !this.audio.duration) return;
      const p = Math.max(0, Math.min(100, percent));
      const t = (p / 100) * this.audio.duration;
      this.audio.currentTime = t;
      musicPlayerStore.setState({ currentTime: t, progress: p });
    }
  }

  static getCurrentProgress(): number {
    if (!this.audio) return 0;
    return (this.audio.currentTime / (this.audio.duration || 1)) * 100;
  }

  static onEnded(callback: () => void) {
    this.audio?.addEventListener("ended", callback);
  }

  static async playYoutube(audioEl: any) {
    console.log("playYoutube");
    if (!audioEl) return;

    // console.log("play inside MusicPlayerManager", audioEl);
    // console.log("videoId", audioEl.videoId);
    const p = audioEl;
    console.log("play once");
    p.mute(); // safe
    console.log("did mute");
    try {
      p.playVideo(); // starts muted, allowed
      // console.log("playVideo");
      // await new Promise((r) => setTimeout(r, 500)); // brief tick so player actually transitions
      // console.log("new Promise");
      // p.unMute();
      // console.log("unmute");
      // p.setVolume(70);
      // console.log("setVolume");
      // console.log("play...");
      // p.playVideo();
    } catch (e) {
      console.log("play failed, error", e);
    }
  }

  static async onYTStateChange(e: any) {
    // const { setIsPlaying } = musicPlayerStore.getState();
    const YT = (window as any).YT;
    if (!YT) return;
    if (e.data === YT.PlayerState.PLAYING) {
      console.log("state changed to Playing, unmute");
      this.audio.unMute();
      // console.log("CHANGING STATE", e, "Setting playing true");
      // setIsPlaying(true);
    }
    if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
      console.log("state changed to Ended/Paused", YT.PlayerState, e.data);
      if (e.data === YT.PlayerState.PAUSED) {
        console.log("paused, now resuming in 1 second");
        await new Promise((r) => setTimeout(r, 1000));
        this.audio.playVideo();
        this.audio.playVideo();
        await this.resume();
      }
      await new Promise((r) => setTimeout(r, 1000));
      // console.log("on ended, playVideo", this.audio.playVideo);
      // this.audio.playVideo();
      // console.log("exec playVideo");
    }

    // setIsPlaying(false);
  }
}
