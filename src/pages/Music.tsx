import React, { useEffect, useState, useRef } from "react";

type JamendoTrack = {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  album_image: string;
};

export default function Music() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch chill tracks from Jamendo
  useEffect(() => {
    const fetchTracks = async () => {
      const res = await fetch(
        "https://api.jamendo.com/v3.0/tracks/?client_id=17ed92bf&format=json&limit=10&fuzzytags=chill",
      );
      const data = await res.json();
      setTracks(data.results);
    };
    fetchTracks();
  }, []);

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 0);
  };

  const pauseTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div
        className={
          " bg-[#371A4D] h-screen p-4 pt-12 w-full flex flex-col gap-4 items-center text-white"
        }
      >
        <div>
          <p className={"testing-iframe"}>
            This is a component for testing the iframe from youtube
          </p>
        </div>
        <div className="p-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">🎧 Jamendo Chill Tracks</h2>

          <ul className="space-y-4">
            {tracks.map((track) => (
              <li
                key={track.id}
                className="border p-4 rounded-lg hover:shadow-lg flex items-center gap-4"
              >
                <img
                  src={track.album_image}
                  alt={track.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <div className="font-semibold">{track.name}</div>
                  <div className="text-sm text-gray-500">
                    {track.artist_name}
                  </div>
                </div>
                <button
                  onClick={() => playTrack(track)}
                  className="bg-purple-600 text-white px-3 py-1 rounded"
                >
                  ▶️ Play
                </button>
              </li>
            ))}
          </ul>

          {currentTrack && (
            <div className="mt-6 p-4 border-t">
              <h3 className="text-lg font-bold mb-2">Now Playing</h3>
              <div className="flex items-center gap-4">
                <img
                  src={currentTrack.album_image}
                  alt={currentTrack.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <div className="font-semibold">{currentTrack.name}</div>
                  <div className="text-sm text-gray-500">
                    {currentTrack.artist_name}
                  </div>
                </div>
                <button
                  onClick={togglePlayback}
                  className="bg-purple-500 text-white px-4 py-1 rounded"
                >
                  {isPlaying ? "⏸ Pause" : "▶️ Resume"}
                </button>
              </div>

              <audio
                ref={audioRef}
                src={currentTrack.audio}
                onEnded={() => setIsPlaying(false)}
                autoPlay
                className="w-full mt-4"
                controls
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
