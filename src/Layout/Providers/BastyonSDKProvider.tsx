import { SdkService } from "../../bastyon-sdk/sdkService.ts";
import { ReactNode, useEffect } from "react";

export const BastyonSDKProvider = ({ children }: { children: ReactNode }) => {
  // console.log("SDK init");
  const getUserInfo = async () => {
    const userInfo = await SdkService.getUsersInfo();
  };

  const init = async () => {
    const sdkInfo = await SdkService.init();

    console.log("sdk info", sdkInfo);
  };

  useEffect(() => {
    void SdkService.init();
    void SdkService.requestPermissions();
    void getUserInfo();
    void SdkService.getAppInfo();
    void SdkService.showHelperMessage("test helper message");
  }, []);

  return <>{children}</>;
};
