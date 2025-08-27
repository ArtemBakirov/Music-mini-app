import { create } from "zustand";

type Platform = "ios" | "android" | "desktop" | "unknown";

type DeviceState = {
  isMobile: boolean;
  platform: Platform;
  width: number;
  height: number;
  set: (patch: Partial<DeviceState>) => void;
};

export const useDesktopMobileStore = create<DeviceState>((set) => ({
  isMobile: false,
  platform: "unknown",
  width: 0,
  height: 0,
  set: (patch) => set(patch),
}));

// handy selector hook
export const useDevice = () =>
  useDesktopMobileStore((s) => ({
    isMobile: s.isMobile,
    platform: s.platform,
    width: s.width,
    height: s.height,
  }));
