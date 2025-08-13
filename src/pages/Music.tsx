import { useEffect, useState, useRef } from "react";
import { SdkService } from "../bastyon-sdk/sdkService";
import { useViewStateStore } from "../hooks/stores/useViewStateStore";
import { DisplayJamendoSongCard } from "../components/DisplayJamendoSongCard";
import { SearchInput } from "../components/SearchInput";

// i18n
import { useTranslation } from "../utils/i18n.ts";

export default function Music() {
  const { t } = useTranslation();

  /*useEffect(() => {
    void SdkService.init();
    void SdkService.requestPermissions();
    void SdkService.getUsersInfo();
  }, []);*/

  function buildUrl(
    resource: "tracks" | "albums" | "artists" | "playlists",
    params: Record<string, string | number | boolean | undefined>,
  ) {
    const search = new URLSearchParams();
    search.set("client_id", import.meta.env.VITE_JAMENDO_CLIENT_ID);
    search.set("format", "json");
    if (resource !== "artists") {
      search.set("imagesize", "600"); // nicer covers
    }
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) search.set(k, String(v));
    });
    const url = `${import.meta.env.VITE_JAMENDO_BASE_URL}/${resource}/?${search.toString()}`;
    if (resource === "artists") {
      // console.log("built url", url);
    }
    return url;
  }

  type JamendoTrack = {
    id: string;
    name: string;
    artist_id: string;
    artist_name: string;
    album_name: string;
    album_image: string;
    audio: string; // stream/preview
  };

  type JamendoAlbum = {
    id: string;
    name: string;
    artist_name: string;
    image: string;
  };

  type JamendoArtist = {
    id: string;
    name: string;
    image: string;
  };

  type JamendoPlaylist = {
    id: string;
    name: string;
    image: string;
    user_name?: string;
  };

  const [query, setQuery] = useState("");
  const { setSearchQuery, searchQuery, showSearchResults } =
    useViewStateStore();

  const [tracks, setTracks] = useState<any[]>([]);
  const [page, setPage] = useState(1); // logical page for offset calc
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // other sections
  const [albums, setAlbums] = useState<JamendoAlbum[]>([]);
  const [artists, setArtists] = useState<JamendoArtist[]>([]);
  const [playlists, setPlaylists] = useState<JamendoPlaylist[]>([]);
  const [loadingOthers, setLoadingOthers] = useState(false);

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
    const limit = 12;
    const offset = (currentPage - 1) * limit;

    const url = buildUrl("tracks", {
      search: searchText, // or fuzzytags: q
      limit,
      page: currentPage,
      order: "popularity_total",
      include: "musicinfo",
      audioformat: "mp31", // decent preview
    });

    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${import.meta.env.VITE_JAMENDO_CLIENT_ID}&format=json&limit=${limit}&offset=${offset}&search=${searchText}`,
    );

    const data = await response.json();
    // console.log("Fetched Jamendo data:", data);

    setHasMore(data.results.length === limit);

    if (currentPage === 1) {
      setTracks(data.results);
    } else {
      setTracks((prev) => [...prev, ...data.results]);
    }

    setLoading(false);
  };

  const fetchOthers = async (q: string) => {
    setLoadingOthers(true);

    const [albumsRes, artistsRes, playlistsRes] = await Promise.all([
      fetch(
        buildUrl("albums", {
          search: q,
          limit: 12,
          order: "popularity_total",
        }),
      ),
      fetch(
        buildUrl("artists", {
          namesearch: q, // Jamendo artists prefer "name"
          limit: 12,
          order: "popularity_total",
        }),
      ),
      fetch(
        buildUrl("playlists", {
          search: q,
          limit: 12,
          order: "name",
        }),
      ),
    ]);

    const albumsJson = await albumsRes.json();
    const artistsJson = await artistsRes.json();
    const playlistsJson = await playlistsRes.json();

    // console.log("artists, playlists", artistsJson, playlistsJson);

    setAlbums(
      (albumsJson.results || []).map((a: any) => ({
        id: a.id,
        name: a.name,
        artist_name: a.artist_name,
        image: a.image,
      })),
    );

    setArtists(
      (artistsJson.results || []).map((a: any) => ({
        id: a.id,
        name: a.name,
        image: a.image,
      })),
    );

    setPlaylists(
      (playlistsJson.results || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        user_name: p.user_name,
      })),
    );

    setLoadingOthers(false);
  };

  const handleSearch = () => {
    if (query.trim()) {
      showSearchResults();
      setSearchQuery(query);
      setPage(1);
      void fetchTracks(query, 1);
      void fetchOthers(query);
    }
  };

  useEffect(() => {
    if (page > 1 && searchQuery) {
      fetchTracks(searchQuery, page);
    }
  }, [page]);

  return (
    <div className="flex flex-col bg-[#371A4D] text-white h-screen w-full p-6 pt-16 mb-24 overflow-hidden">
      <div className="w-full max-w-2xl mx-auto mb-6">
        <SearchInput query={query} setQuery={setQuery} onClick={handleSearch} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-10 pr-1 py-4">
        {/* 1) Tracks */}
        {tracks.length > 0 && (
          <section>
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Titel</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {tracks.map((track, idx) => {
                const isLast = idx === tracks.length - 1;
                return (
                  <>
                    <div key={track.id}>
                      <DisplayJamendoSongCard songData={track} idx={idx} />
                    </div>
                    {/* <div key={track.id} ref={isLast ? observerRef : null}>
                      <DisplayJamendoSongCard songData={track} idx={idx} />
                    </div> */}
                  </>
                );
              })}
            </div>

            {loading && (
              <div className="text-center text-sm mt-3">Loading more…</div>
            )}
            {!hasMore && tracks.length > 0 && (
              <div className="text-center text-sm mt-3 opacity-70">
                No more results
              </div>
            )}
          </section>
        )}

        {/* 2) Albums */}
        {(albums.length > 0 || loadingOthers) && (
          <section>
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Alben</h2>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {albums.map((a) => (
                <div key={a.id} className="group">
                  <div className="aspect-square overflow-hidden rounded-lg bg-[#222]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.image}
                      alt={a.name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition"
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium truncate">
                    {a.name}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {a.artist_name}
                  </div>
                </div>
              ))}
              {loadingOthers &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-[#1f1f1f] animate-pulse"
                  />
                ))}
            </div>
          </section>
        )}

        {/* 3) Artists */}
        {(artists.length > 0 || loadingOthers) && (
          <section>
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Künstler:innen</h2>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
              {artists.map((ar) => (
                <div key={ar.id} className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-[#222]">
                    <img
                      src={ar.image}
                      alt={ar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2 text-sm">{ar.name}</div>
                </div>
              ))}
              {loadingOthers &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-28 h-28 rounded-full bg-[#1f1f1f] animate-pulse"
                  />
                ))}
            </div>
          </section>
        )}

        {/* 4) Playlists */}
        {(playlists.length > 0 || loadingOthers) && (
          <section>
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Playlists</h2>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {playlists.map((pl) => (
                <div key={pl.id} className="group">
                  <div className="aspect-square overflow-hidden rounded-lg bg-[#222]">
                    <img
                      src={pl.image}
                      alt={pl.name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition"
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium line-clamp-1">
                    {pl.name}
                  </div>
                  {pl.user_name && (
                    <div className="text-xs text-gray-400 line-clamp-1">
                      {pl.user_name}
                    </div>
                  )}
                </div>
              ))}
              {loadingOthers &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-[#1f1f1f] animate-pulse"
                  />
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
