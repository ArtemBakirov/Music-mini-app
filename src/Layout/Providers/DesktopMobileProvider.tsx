import { ReactNode, useEffect, useMemo, useState } from "react";
import { useDesktopMobileStore } from "../../hooks/stores/useDesktopMobileStore.ts";
import { DesktopTabletLayout } from "../DesktopTabletLayout.tsx";

type Props = {
  // mobile: ReactNode; // what to render on mobile
  // desktop: ReactNode; // what to render on desktop
  breakpoint?: number; // px, default 768
  fallback?: ReactNode; // optional SSR/first-render fallback
};

function detectPlatform(ua: string): "ios" | "android" | "desktop" | "unknown" {
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Mac|Win|Linux/i.test(ua)) return "desktop";
  return "unknown";
}

export const DesktopMobileProvider = ({
  breakpoint = 768,
  fallback = null,
}: Props) => {
  const set = useDesktopMobileStore((s) => s.set);
  const isMobileFromStore = useDesktopMobileStore((s) => s.isMobile);
  // const inBastyon = SdkService.inBastyon();
  // console.log("inBastyon ", inBastyon);

  // SSR-safe first guess to avoid hydration mismatch
  const initialIsMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  }, [breakpoint]);

  const [ready, setReady] = useState(typeof window !== "undefined");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const compute = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Multiple signals for better accuracy
      const ua = navigator.userAgent || "";
      const uaDataMobile = (navigator as any).userAgentData?.mobile === true;
      const touch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        uaDataMobile;
      const media = window.matchMedia(
        `(max-width: ${breakpoint - 1}px)`,
      ).matches;

      const isMobile = media || uaDataMobile || touch;
      const platform = detectPlatform(ua);
      // console.log("device, is mobile?", isMobile, platform, width, height);
      /* if (isMobile) {
        if (inBastyon) {
          void SdkService.showHelperMessage("mobile detected");
        }
      } else {
        if (inBastyon) {
          void SdkService.showHelperMessage("desktop");
        }
      } */

      set({ isMobile, platform, width, height });
    };

    compute();
    setReady(true);

    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize as any);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize as any);
    };
  }, [breakpoint, set]);

  // Before the effect runs on the client, render a deterministic UI
  if (!ready) {
    return (
      fallback ??
      (initialIsMobile ? (
        <>{<DesktopTabletLayout />}</>
      ) : (
        <>{<DesktopTabletLayout />}</>
      ))
    );
  }

  return isMobileFromStore ? (
    <>{<DesktopTabletLayout />}</>
  ) : (
    <>{<DesktopTabletLayout />}</>
  );
};
