import { useState } from "react";

export default function Music({ onSelect }: { onSelect: (videoId: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const search = async () => {
    const res = await fetch(`http://localhost:3000/api/music/youtubeSearch?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    console.log("data is", data);
    setResults(data);
  };

  return (
    <div className={"text-black"}>
      <input
        className={"border border-gray-300 p-2 rounded w-full mb-4"}
        type="text"
        placeholder="Search music..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={search}>Search</button>
      <div className={"flex flex-col gap-4 padding-2"}>
        {results.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition"
          >
            {/* Thumbnail */}
            <img
              src={`https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-lg"
            />

            {/* Song Info */}
            <div className="flex flex-col flex-grow">
              <div className="text-lg font-semibold">{item.title}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                  alt="YouTube"
                  className="w-12 h-auto"
                />
                <span className="text-xs text-gray-400">YouTube Music</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const allIframes = document.querySelectorAll('iframe[id^="yt-player-"]');

                  // Pause all other players
                  allIframes.forEach((iframe) => {
                    const id = iframe.getAttribute('id');
                    if (id !== `yt-player-${item.videoId}`) {
                      (iframe as HTMLIFrameElement).contentWindow?.postMessage(
                        '{"event":"command","func":"pauseVideo","args":""}',
                        '*'
                      );
                    }
                  });

                  // Play this player
                  const current = document.getElementById(`yt-player-${item.videoId}`) as HTMLIFrameElement;
                  current?.contentWindow?.postMessage(
                    '{"event":"command","func":"playVideo","args":""}',
                    '*'
                  );
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
              >
                ▶ Play
              </button>

              <button
                onClick={() => {
                  const player = document.getElementById(`yt-player-${item.videoId}`) as HTMLIFrameElement;
                  player?.contentWindow?.postMessage(
                    '{"event":"command","func":"pauseVideo","args":""}',
                    '*'
                  );
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
              >
                ⏸ Pause
              </button>
            </div>

            {/* Hidden YouTube Player */}
            <div className="hidden">
              <iframe
                id={`yt-player-${item.videoId}`}
                width="0"
                height="0"
                src={`https://www.youtube.com/embed/${item.videoId}?enablejsapi=1`}
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
                title={item.title}
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
