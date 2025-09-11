/*
 * changes between different sources: jamendo, youtube, music from the users etc., based on
 * the Zustand state
 * */
import { useSourceStore } from "../hooks/stores/useSourceStore";
import Music from "./Music.tsx";
import { BastyonMusic } from "./BastyonMusic.tsx";
import YouTubeMusic from "./YoutubePages/YouTubeMusic.tsx";
export const MusicPageContainer = () => {
  const source = useSourceStore((s) => s.source);

  return (
    <div className="flex flex-col bg-[#371A4D] text-white h-screen w-full overflow-hidden">
      {source === "jamendo" ? (
        <Music />
      ) : source === "youtube" ? (
        <YouTubeMusic />
      ) : (
        <BastyonMusic />
      )}
    </div>
  );
};
