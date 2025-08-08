import { useEffect, useState, useRef } from "react";
import { SdkService } from "../bastyon-sdk/sdkService";
import { useViewStateStore } from "../hooks/stores/useViewStateStore";
import { DisplayJamendoSongCard } from "../components/DisplayJamendoSongCard";
import { SearchInput } from "../components/SearchInput";

export default function Music() {
  useEffect(() => {
    void SdkService.init();
    void SdkService.requestPermissions();
    void SdkService.getUsersInfo();
  }, []);

  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [page, setPage] = useState(1); // logical page for offset calc
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { setSearchQuery, searchQuery, showSearchResults } =
    useViewStateStore();

  const observer = useRef<IntersectionObserver | null>(null);

  const observerRef = (node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  const fetchTracks = async (searchText: string, currentPage = 1) => {
    setLoading(true);
    const limit = 10;
    const offset = (currentPage - 1) * limit;

    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=17ed92bf&format=json&limit=${limit}&offset=${offset}&search=${searchText}`,
    );

    const data = await response.json();
    console.log("Fetched Jamendo data:", data);

    setHasMore(data.results.length === limit);

    if (currentPage === 1) {
      setTracks(data.results);
    } else {
      setTracks((prev) => [...prev, ...data.results]);
    }

    setLoading(false);
  };

  const handleSearch = () => {
    if (query.trim()) {
      showSearchResults();
      setSearchQuery(query);
      setPage(1);
      fetchTracks(query, 1);
    }
  };

  useEffect(() => {
    if (page > 1 && searchQuery) {
      fetchTracks(searchQuery, page);
    }
  }, [page]);

  return (
    <div className="bg-[#371A4D] text-white h-screen w-full overflow-y-auto p-4 pt-16">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🎶 Jamendo Music Search
      </h2>

      <div className="w-full max-w-lg mx-auto mb-4">
        <SearchInput query={query} setQuery={setQuery} onClick={handleSearch} />
      </div>

      <div className="flex flex-col gap-4">
        {tracks.map((track, idx) => {
          const isLast = idx === tracks.length - 1;
          return (
            <div key={track.id} ref={isLast ? observerRef : null}>
              <DisplayJamendoSongCard songData={track} idx={idx} />
            </div>
          );
        })}
      </div>

      {loading && <div className="text-center mt-4">Loading more songs...</div>}
      {!hasMore && tracks.length > 0 && (
        <div className="text-center mt-4">No more results</div>
      )}
    </div>
  );
}
