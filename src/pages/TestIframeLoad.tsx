import { useEffect, useRef } from "react";
import { TestIframe } from "./TestIframe.tsx";

export const TestIframeLoad = () => {
  const itemRefs = useRef<Array<any | null>>([]);

  const playAll = async () => {
    // Browsers may block if not initiated by a user gesture. Call this inside onClick.
    await Promise.all(
      itemRefs.current.map((h) => h?.play()).filter(Boolean) as Promise<void>[],
    );
  };

  const sources = [
    "TdrL3QxjyVw",
    "o_1aF54DO60",
    "UMMZWMbdv2w",
    "cE6wxDqdOV0",
    "F4ELqraXx-U",
  ];

  useEffect(() => {
    console.log("try to play all");
    void playAll();
  }, []);

  return (
    <div className="flex flex-col">
      {sources.map((id, i) => (
        <TestIframe
          key={id}
          videoId={id}
          ref={(el) => {
            itemRefs.current[i] = el;
          }} // callback ref works well in lists
        />
      ))}
      <div>
        <button onClick={playAll}>ALL PLAY LOAD11</button>
      </div>
    </div>
  );
};
