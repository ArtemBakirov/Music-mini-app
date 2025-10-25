// pages/YouTubeArtists.tsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchYouTubeChannels } from "../../api/youtubeApi";
import { RenderArtists } from "./RenderArtists.tsx";

export default function RenderInfiniteArtists() {
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

  const fetchNextPage = async () => {
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

  // const observer = useRef<IntersectionObserver | null>(null);
  /* const lastRef = (node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) loadMore();
    });
    if (node) observer.current.observe(node);
  };*/

  // IntersectionObserver sentinel to load more
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { root: null, rootMargin: "300px 0px", threshold: 0 },
    );

    io.observe(el);
    return () => io.unobserve(el);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!query) return <div className="p-6 mt-16">No query.</div>;
  if (err) return <div className="p-6 mt-16 text-red-400">{err}</div>;
  if (loading && pages.length === 0)
    return <div className="p-6 mt-16">Loading…</div>;

  return (
    <div className="h-screen overflow-hidden w-full flex flex-col p-6 mt-16 gap-6 bg-[#371A4D] text-white">
      <RenderArtists query={query} artists={artists} />
      <div ref={sentinelRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage ? (
          <span className="text-sm opacity-70">Loading more…</span>
        ) : !hasNextPage && artists.length > 0 ? (
          <span className="text-xs opacity-50">No more results</span>
        ) : null}
      </div>
    </div>
  );
}
