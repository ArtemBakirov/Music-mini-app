// utils/YoutubePlayerManager.ts
type PlayerEventCallback = (event: YT.OnStateChangeEvent) => void;

class YoutubePlayerManager {
  private static instance: YoutubePlayerManager;
  private player: YT.Player | null = null;
  private container: HTMLDivElement | null = null;
  private onStateChangeCallback: PlayerEventCallback | null = null;

  private constructor() {}

  public static getInstance(): YoutubePlayerManager {
    if (!YoutubePlayerManager.instance) {
      YoutubePlayerManager.instance = new YoutubePlayerManager();
    }
    return YoutubePlayerManager.instance;
  }

  public initPlayer(
    container: HTMLDivElement,
    videoId: string,
    onStateChange: PlayerEventCallback,
  ) {
    if (this.player) {
      this.player.destroy();
    }

    this.container = container;
    this.onStateChangeCallback = onStateChange;

    this.player = new YT.Player(container, {
      videoId,
      events: {
        onReady: () => this.play(),
        onStateChange: (e) => {
          if (this.onStateChangeCallback) this.onStateChangeCallback(e);
        },
      },
    });
  }

  public play() {
    this.player?.playVideo();
  }

  public pause() {
    this.player?.pauseVideo();
  }

  public seekTo(percent: number) {
    if (!this.player) return;
    const duration = this.player.getDuration();
    this.player.seekTo((percent / 100) * duration, true);
  }

  public getProgress(): number {
    if (!this.player) return 0;
    const current = this.player.getCurrentTime();
    const duration = this.player.getDuration() || 1;
    return (current / duration) * 100;
  }

  public destroy() {
    this.player?.destroy?.();
    this.player = null;
    this.container = null;
  }
}

export const youtubePlayerManager = YoutubePlayerManager.getInstance();
