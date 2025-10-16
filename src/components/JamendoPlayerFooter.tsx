import { useEffect, useRef, useState } from "react";
import { useMusicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";
import { ProgressBar } from "./ProgressBar.tsx";
import { MusicPlayerManager } from "../utils/MusicPlayerManager.ts";
import { FooterController } from "./FooterController.tsx";
import DragHandle from "../assets/icons/dragHandle.svg?react";

// animations
import { motion, useMotionValue, useDragControls } from "framer-motion";
import { Vibrant } from "node-vibrant/browser";

// mobile / desktop
import { useDesktopMobileStore } from "../hooks/stores/useDesktopMobileStore.ts";

// for yt
import YouTube, { YouTubeProps } from "react-youtube";

export const JamendoPlayerFooter = () => {
  const audioRef = useRef<HTMLAudioElement | any>(null);

  // animations/ extended
  const [isExpanded, setIsExpanded] = useState(false);
  const [bgColor, setBgColor] = useState("#2D0F3A");

  // console.log("is Expanded", isExpanded);

  // console.log("audioref", audioRef);

  const currentSong = useMusicPlayerStore((s) => s.currentSong);

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

  // console.log("in footer device", isMobile, platform, width, height);

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
    width: "200",
    height: "100",
    playerVars: {
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      // no autoplay here; we control it manually
      origin: window.location.origin,
    },
  };

  const onYTReady: YouTubeProps["onReady"] = (e) => {
    MusicPlayerManager.init(e.target); // YT.Player
  };

  const onYTStateChange: YouTubeProps["onStateChange"] = (e) => {
    MusicPlayerManager.onYTStateChange?.(e);
  };

  const handleError = (e) => {
    console.log("error in youtube", e);
  };

  // 🎵 Drag logic for mobile
  // const y = useMotionValue(0);
  /* const opacity = useTransform(y, [0, -300], [1, 0]);
  const handleDragEnd = (_, info) => {
    if (info.offset.y < -100) setIsExpanded(true);
    else if (info.offset.y > 100) setIsExpanded(false);
  }; */

  // drag contols
  const contols = useDragControls();
  const y = useMotionValue(0);

  // if (!currentSong) return null;
  if (!isMobile) {
    return (
      <div
        className={`bg-[#2D0F3A] text-white p-4 flex justify-between
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
    <div>
      <div
        className={`text-white z-50 rounded-t-2xl overflow-hidden
            shadow-lg`}
      >
        {/* Mini Footer (collapsed) */}
        {!isExpanded && (
          <div
            onClick={() => setIsExpanded(true)}
            className="flex items-center px-4 py-4 bg-[#2D0F3A]"
          >
            <img
              src={currentSong?.album_image}
              alt=""
              className="w-12 h-12 rounded object-cover flex-shrink-0 mr-4"
            />

            <div className="flex-1 min-w-0 basis-0">
              <p className="font-semibold truncate">
                {currentSong?.title || currentSong?.name}
              </p>
              <p className="text-xs text-gray-300 truncate">
                {currentSong?.artist_name}
              </p>
            </div>

            <div className={"flex-shrink-0"}>
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
          </div>
        )}

        {/* Fullscreen Player */}
        {isExpanded && (
          <motion.div
            // onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between h-[100vh] px-6 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className={
                "touch-none absolute bg-[#2D0F3A] flex flex-col items-center justify-center gap-6 bottom-0 h-[100vh] w-full overflow-hidden"
              }
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ ease: "easeInOut" }}
              drag={"y"}
              dragControls={contols}
              onDragEnd={() => {
                if (y.get() >= 100) {
                  setIsExpanded(false);
                }
                console.log("on end", y.get());
              }}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              style={{ y, touchAction: "none" }}
              // onPointerDown={(e) => contols.start(e)}
            >
              <DragHandle
                onPointerDown={(e) => contols.start(e)}
                className="w-56 h-24 absolute left-0, right-0, -top-1 z-10"
              />
              <img
                src={currentSong?.album_image}
                alt=""
                className="w-72 h-72 rounded-xl object-cover shadow-2xl"
              />
              <div className="flex flex-col items-center gap-2 text-center mt-4">
                <div className="font-bold text-xl">
                  {currentSong?.title || currentSong?.name}
                </div>
                <div className="text-gray-200">{currentSong?.artist_name}</div>
              </div>

              <ProgressBar />

              <div className={"flex-shrink-0"}>
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
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* audio/youtube elements (still hidden) */}
      {provider === "jamendo" && <audio ref={audioRef} onEnded={handleEnded} />}
      {provider === "youtube" && (
        <YouTube
          opts={opts}
          onReady={onYTReady}
          onStateChange={onYTStateChange}
          onError={handleError}
        />
      )}
    </div>
  );
};
