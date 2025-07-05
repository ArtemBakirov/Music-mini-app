import { useQuery } from "@tanstack/react-query";
import apiInstance from "../utils/axios.ts";
import { useMemo } from "react";

interface ArtistInfo {
  name: string;
  url: string;
  image: { "#text": string; size: string }[];
  bio?: { summary?: string };
  // You can extend this as needed
}

export const useArtistInfo = (videoTitle: string | null) => {
  const name = videoTitle?.split("-")[0]?.split("–")[0]?.trim().toLowerCase();
  const normalizedName = useMemo(() => {
    if (!videoTitle) return null;
    return videoTitle.split("-")[0].split("–")[0].trim().toLowerCase();
  }, [videoTitle]);

  return useQuery<ArtistInfo, Error>({
    queryKey: ["artist", normalizedName],
    queryFn: () =>
      apiInstance
        .get(`/artistInfo/${encodeURIComponent(name || "")}`)
        .then((res) => res.data),
    enabled: !!normalizedName,
    cacheTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60, // ✅ 1 hour: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false, // Optional: don't refetch on tab focus
    refetchOnMount: false, // Optional: don't refetch on component remount
  });
};
