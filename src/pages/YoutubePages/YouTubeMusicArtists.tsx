// pages/YouTubeArtists.tsx
import { useMemo, useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchYouTubeChannels } from "../../api/youtubeApi";

export default function YouTubeMusicArtists() {
  const YT_API_KEY =
    import.meta.env.VITE_YT_API_KEY ||
    "AIzaSyCUpYD21lRefE6F_WuO993Z4ityPj3aQdw";
  const { query = "" } = useParams();
  console.log("query", query);

  const [pages, setPages] = useState<any[][]>([]);
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // load first page when query changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!query) return;
      setLoading(true);
      setErr(null);
      try {
        const { items, nextPageToken } = await fetchYouTubeChannels(
          YT_API_KEY,
          query,
          undefined,
          24,
        );
        if (!cancelled) {
          setPages([items]);
          setNextToken(nextPageToken);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e.message ?? "Failed to load artists");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const artists = useMemo(() => pages.flat(), [pages]);

  // infinite scroll via IntersectionObserver
  const isFetchingNextPage = loading && pages.length > 0;
  const hasNextPage = Boolean(nextToken);

  const loadMore = async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    setLoading(true);
    try {
      const { items, nextPageToken } = await fetchYouTubeChannels(
        YT_API_KEY,
        query,
        nextToken,
        24,
      );
      setPages((prev) => [...prev, items]);
      setNextToken(nextPageToken);
    } catch (e: any) {
      setErr(e.message ?? "Failed to load more artists");
    } finally {
      setLoading(false);
    }
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastRef = (node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) loadMore();
    });
    if (node) observer.current.observe(node);
  };

  if (!query) return <div className="p-6 mt-16">No query.</div>;
  if (err) return <div className="p-6 mt-16 text-red-400">{err}</div>;
  if (loading && pages.length === 0)
    return <div className="p-6 mt-16">Loading…</div>;

  return (
    <div className="h-screen overflow-hidden w-full flex flex-col p-6 mt-16 gap-6">
      <h1 className="text-xl font-bold">Artists – “{query}”</h1>

      <div className="overflow-y-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
        {artists.map((ch, idx) => {
          const isLast = idx === artists.length - 1;
          return (
            <div
              key={ch.id}
              ref={isLast ? lastRef : undefined}
              className="flex flex-col items-center"
            >
              <Link
                to={`/ytsearch/artist/tracks/${ch.id}`}
                replace
                className="w-28 h-28 rounded-full overflow-hidden bg-[#222] block"
              >
                <img
                  src={ch.thumbnail}
                  alt={ch.title}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="mt-2 text-sm truncate max-w-28 text-center">
                <Link
                  to={`/ytsearch/artist/tracks/${ch.id}`}
                  replace
                  className="hover:underline"
                >
                  {ch.title}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <div className="text-sm opacity-70">Loading more…</div>
      )}
      {!hasNextPage && artists.length > 0 && (
        <div className="text-sm opacity-70">No more results</div>
      )}
    </div>
  );
}
