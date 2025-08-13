import { SdkService } from "../../bastyon-sdk/sdkService.ts";
import { ReactNode, useEffect } from "react";

export const BastyonSDKProvider = ({ children }: { children: ReactNode }) => {
  console.log("SDK init");
  useEffect(() => {
    void SdkService.init();
    void SdkService.requestPermissions();
    void SdkService.getUsersInfo();
  }, []);

  return <>{children}</>;
};
