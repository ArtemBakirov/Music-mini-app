import { create } from "zustand";

export type Source = "jamendo" | "youtube" | "bastyon music";

export const useSourceStore = create<{
  source: Source;
  setSource: (source: Source) => void;
}>((set) => ({
  source: "youtube",
  setSource: (source: Source) => set({ source }),
}));
