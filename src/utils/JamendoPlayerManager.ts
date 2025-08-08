export class JamendoPlayerManager {
  private static audio: HTMLAudioElement | null = null;

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

  static pause() {
    this.audio?.pause();
  }

  static resume() {
    this.audio?.play();
  }

  static seekTo(percent: number) {
    if (!this.audio) return;
    const duration = this.audio.duration || 1;
    this.audio.currentTime = (percent / 100) * duration;
  }

  static getCurrentProgress(): number {
    if (!this.audio) return 0;
    return (this.audio.currentTime / (this.audio.duration || 1)) * 100;
  }

  static onEnded(callback: () => void) {
    this.audio?.addEventListener("ended", callback);
  }
}
