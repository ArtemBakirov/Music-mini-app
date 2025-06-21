// useViewStore.ts
import { create } from "zustand";

type ViewState = {
  viewMode: "search" | "playlist";
  searchQuery: string;
  selectedPlaylistId: string | null;
  setSearchQuery: (query: string) => void;
  showSearchResults: () => void;
  showPlaylist: (playlistId: string) => void;
};

export const useViewStateStore = create<ViewState>((set) => ({
  viewMode: "search",
  searchQuery: "",
  selectedPlaylistId: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  showSearchResults: () => set({ viewMode: "search", selectedPlaylistId: null }),
  showPlaylist: (playlistId) => set({ viewMode: "playlist", selectedPlaylistId: playlistId }),
}));
