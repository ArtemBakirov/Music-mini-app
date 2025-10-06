import { useEffect, useRef, useState } from "react";
import { useMusicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";
import { ProgressBar } from "./ProgressBar.tsx";
import { MusicPlayerManager } from "../utils/MusicPlayerManager.ts";
import { FooterController } from "./FooterController.tsx";

// animations
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  useAnimationControls,
} from "framer-motion";
import { Vibrant } from "node-vibrant/browser";

// mobile / desktop
import { useDesktopMobileStore } from "../hooks/stores/useDesktopMobileStore.ts";

// for yt
import YouTube, { YouTubeProps } from "react-youtube";

export const JamendoPlayerFooter = () => {
  const audioRef = useRef<HTMLAudioElement | any>(null);

  // animations
  const [isExpanded, setIsExpanded] = useState(false);
  const [bgColor, setBgColor] = useState("#2D0F3A");

  // --- Viewport + panel sizing ---
  const viewportH = Math.max(
    // prefer store height, fall back to window
    useDesktopMobileStore.getState().height || 0,
    typeof window !== "undefined" ? window.innerHeight : 0,
  );
  const FOOTER_H = 64; // closed footer height (px). tweak to match your design
  const PANEL_H = Math.max(0, viewportH - FOOTER_H);

  // Snap positions (translateY relative to bottom-anchored wrapper)
  const CLOSED_Y = 0;
  const OPEN_Y = -PANEL_H;

  // animation controller
  const controls = useAnimationControls();

  const currentSong = useMusicPlayerStore((s) => s.currentSong);

  // snap helper
  const snapTo = (open: boolean) => {
    setIsExpanded(open);
    controls.start({
      y: open ? OPEN_Y : CLOSED_Y,
      transition: { type: "spring", stiffness: 600, damping: 42 }, // crisp + fast
    });
  };

  useEffect(() => {
    controls.set(isExpanded ? OPEN_Y : CLOSED_Y);
  }, [controls, OPEN_Y, CLOSED_Y, isExpanded, currentSong]);

  // console.log("audioref", audioRef);

  // console.log("current song", currentSong);

  // console.log("currentSong footer", currentSong);

  // Extract color from album cover
  useEffect(() => {
    if (currentSong?.album_image) {
      Vibrant.from(currentSong.album_image)
        .getPalette()
        .then((palette) => {
          const color = palette.Vibrant?.hex || "#2D0F3A";
          setBgColor(color);
        })
        .catch(() => setBgColor("#2D0F3A"));
    }
  }, [currentSong?.album_image]);

  // desktop/mobile store
  const isMobile = useDesktopMobileStore((s) => s.isMobile);
  const platform = useDesktopMobileStore((s) => s.platform);
  const width = useDesktopMobileStore((s) => s.width);
  const height = useDesktopMobileStore((s) => s.height);

  console.log("in footer device", isMobile, platform, width, height);

  const isPlaying = useMusicPlayerStore((s) => s.isPlaying);
  const setIsPlaying = useMusicPlayerStore((s) => s.setIsPlaying);
  const duration = useMusicPlayerStore((s) => s.duration);
  const currentTime = useMusicPlayerStore((s) => s.currentTime);

  // new state/selectors
  const next = useMusicPlayerStore((s) => s.next);
  const prev = useMusicPlayerStore((s) => s.prev);
  const toggleShuffle = useMusicPlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = useMusicPlayerStore((s) => s.cycleRepeat);
  const isShuffling = useMusicPlayerStore((s) => s.isShuffling);
  const repeatMode = useMusicPlayerStore((s) => s.repeatMode);
  const provider = useMusicPlayerStore((s) => s.provider);
  // console.log("provider footer", provider);
  // console.log("provider", provider);
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // mount the ONE audio element
  useEffect(() => {
    // console.log("useEffect footer", audioRef.current, provider);
    if (audioRef.current) {
      if (provider === "jamendo") {
        MusicPlayerManager.init(audioRef.current);
      }
      //
    }
  }, [currentSong]);

  const onDragEnd = (
    _: any,
    info: { offset: { y: number }; velocity: { y: number } },
  ) => {
    const distance = info.offset.y; // positive if dragged downward, negative upward
    const vy = info.velocity.y;

    const DIST_THRESHOLD = PANEL_H * 0.2; // 20% of panel height
    const VEL_THRESHOLD = 600; // px/s

    if (!isExpanded) {
      // Was closed; user dragged up? open if enough
      const shouldOpen = distance < -DIST_THRESHOLD || vy < -VEL_THRESHOLD;
      snapTo(shouldOpen);
    } else {
      // Was open; user dragged down? close if enough
      const shouldClose = distance > DIST_THRESHOLD || vy > VEL_THRESHOLD;
      snapTo(!shouldClose ? true : false);
    }
  };

  const handleEnded = () => {
    console.log("set after ended");
    setIsPlaying(false);
  };

  const handleClick = async () => {
    console.log("click footer");
    if (isPlaying) {
      MusicPlayerManager.pause();
      setIsPlaying(false);
    } else {
      MusicPlayerManager.resume();
      console.log("Change state in Footer");
      setIsPlaying(true);
    }
  };

  const opts: YouTubeProps["opts"] = {
    width: "0",
    height: "0",
    playerVars: {
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      // no autoplay here; we control it manually
      origin: window.location.origin,
    },
  };

  const onYTReady: YouTubeProps["onReady"] = (e) => {
    console.log("onYTReady", e);
    MusicPlayerManager.init(e.target); // YT.Player
  };

  const onYTStateChange: YouTubeProps["onStateChange"] = (e) => {
    MusicPlayerManager.onYTStateChange?.(e);
  };

  const handleError = (e) => {
    console.log("error in youtube", e);
  };

  // 🎵 Drag logic for mobile
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, -300], [1, 0]);
  const handleDragEnd = (_, info) => {
    if (info.offset.y < -100) setIsExpanded(true);
    else if (info.offset.y > 100) setIsExpanded(false);
  };

  // if (!currentSong) return null;
  if (!isMobile) {
    return (
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#2D0F3A] text-white p-4 flex justify-between
    items-center z-50 px-32`}
      >
        <div className="flex items-center gap-4 w-full">
          <div>
            <FooterController
              onPlayPauseClick={handleClick}
              isPlaying={isPlaying}
              onPrevClick={prev}
              onNextClick={next}
              onShuffleClick={toggleShuffle}
              onRepeatClick={cycleRepeat}
              shuffleActive={isShuffling}
              repeatMode={repeatMode}
            />
          </div>
          <div className={"flex flex-col items-center w-full"}>
            <div className={"flex gap-4 justify-center mb-2"}>
              <div className="font-bold">
                {currentSong?.title || currentSong?.name}
              </div>
              <div className="font-bold">{currentSong?.artist_name}</div>
            </div>
            <ProgressBar />
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {currentSong && (
          <>
            {provider === "jamendo" && (
              <div>
                <audio
                  ref={audioRef}
                  onEnded={handleEnded}
                  // style={{ display: "none" }}
                />
              </div>
            )}
            {provider === "youtube" && (
              <>
                <YouTube
                  // ref={audioRef}
                  // videoId={videoId}
                  opts={opts}
                  onReady={onYTReady}
                  onStateChange={onYTStateChange}
                  onError={handleError}
                  // onReady={onReady}
                  // onStateChange={onStateChange}
                />
              </>
            )}
          </>
        )}
      </div>
    );
  }

  // 📱 MOBILE LAYOUT
  return (
    <>
      {/* Draggable sheet that is exactly viewport tall and anchored to bottom */}
      <motion.div
        className="fixed left-0 right-0 bottom-0 z-50 overflow-hidden rounded-t-2xl shadow-lg"
        style={{
          height: viewportH, // sheet fills the screen
          backgroundColor: isExpanded ? bgColor : "#2D0F3A",
        }}
        animate={controls}
        initial={false}
        drag="y"
        dragConstraints={{ top: OPEN_Y, bottom: CLOSED_Y }}
        dragElastic={0.06} // tight feel
        dragMomentum={false} // no fling past constraints
        onDragEnd={onDragEnd}
      >
        {/* CONTENT AREA: translate the inner content so that when CLOSED_Y (0), only the footer band shows */}
        <motion.div
          style={{ y: 0, height: viewportH }}
          className="flex flex-col w-full h-full"
        >
          {/* FULLSCREEN content occupies PANEL_H and lives 'above' the footer */}
          <div className="flex-1 flex flex-col items-center justify-between px-6 py-6">
            {/* Top handle */}
            <div className="w-12 h-1.5 rounded-full bg-white/50 self-center" />

            {/* Artwork */}
            <img
              src={currentSong.album_image}
              alt=""
              className="w-72 h-72 rounded-xl object-cover shadow-2xl mt-4"
            />

            {/* Title/artist */}
            <div className="text-center mt-3">
              <div className="font-bold text-xl truncate">
                {currentSong.title || currentSong.name}
              </div>
              <div className="text-white/80 text-sm truncate">
                {currentSong.artist_name}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full mt-6 px-2">
              <ProgressBar />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-4 mb-4">
              <button onClick={prev} aria-label="Previous">
                ⏮️
              </button>
              <button
                onClick={handleClick}
                className="text-4xl"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>
              <button onClick={next} aria-label="Next">
                ⏭️
              </button>
            </div>
          </div>

          {/* FOOTER BAND (always sticks to bottom). Thinner, no progress bar */}
          <div
            className="h-16 px-4 flex items-center justify-between bg-black/15 backdrop-blur-sm"
            onClick={() => snapTo(true)} // tap to expand
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentSong.album_image}
                alt=""
                className="w-10 h-10 rounded object-cover"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-semibold truncate">
                  {currentSong.title || currentSong.name}
                </span>
                <span className="text-xs text-white/70 truncate">
                  {currentSong.artist_name}
                </span>
              </div>
            </div>
            <div className="flex gap-3 items-center pr-1">
              <button onClick={prev} aria-label="Previous">
                ⏮️
              </button>
              <button
                onClick={handleClick}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>
              <button onClick={next} aria-label="Next">
                ⏭️
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Keep players outside the draggable to avoid pointer/transform quirks */}
      {provider === "jamendo" && (
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      )}
      {provider === "youtube" && (
        <YouTube
          opts={{
            width: "0",
            height: "0",
            playerVars: {
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
              origin: window.location.origin,
            },
          }}
          onReady={(e) => MusicPlayerManager.init(e.target)}
          onStateChange={(e) => MusicPlayerManager.onYTStateChange?.(e)}
          onError={(e) => console.log("YT error", e)}
        />
      )}
    </>
  );
};
