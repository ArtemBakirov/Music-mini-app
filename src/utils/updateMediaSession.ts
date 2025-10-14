import { musicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";
import { MusicPlayerManager } from "./MusicPlayerManager.ts";

export function updateMediaSession(song: {
  title: string;
  artist?: string;
  album?: string;
  artworkUrl?: string;
}) {
  if (!("mediaSession" in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: song.artist ?? "",
    album: song.album ?? "",
    artwork: song.artworkUrl
      ? [
          { src: song.artworkUrl, sizes: "96x96", type: "image/png" },
          { src: song.artworkUrl, sizes: "256x256", type: "image/png" },
          { src: song.artworkUrl, sizes: "512x512", type: "image/png" },
        ]
      : [],
  });

  // Hook lock-screen / notification controls
  navigator.mediaSession.setActionHandler("play", () =>
    MusicPlayerManager.resume(),
  );
  navigator.mediaSession.setActionHandler("pause", () =>
    MusicPlayerManager.pause(),
  );
  navigator.mediaSession.setActionHandler("previoustrack", () =>
    musicPlayerStore.getState().prev(),
  );
  navigator.mediaSession.setActionHandler("nexttrack", () =>
    musicPlayerStore.getState().next(),
  );

  // Optional: seek support (Android)
  navigator.mediaSession.setActionHandler("seekto", (e: any) => {
    if (typeof e.seekTime === "number") {
      const dur = musicPlayerStore.getState().duration || 0;
      const p = dur ? (e.seekTime / dur) * 100 : 0;
      MusicPlayerManager.seekTo(p);
      navigator.mediaSession.setPositionState({
        duration: dur,
        position: e.seekTime,
        playbackRate: 1,
      });
    }
  });

  console.log("updated");
}
