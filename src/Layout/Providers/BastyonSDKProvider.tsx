import { SdkService } from "../../bastyon-sdk/sdkService.ts";
import { ReactNode, useEffect } from "react";
import {
  SdkUserInfo,
  useAccountStore,
} from "../../hooks/stores/useAccountStore";

export const BastyonSDKProvider = ({ children }: { children: ReactNode }) => {
  const setFromSdk = useAccountStore((s) => s.setFromSdk);
  const setLoading = useAccountStore((s) => s.setLoading);
  const setError = useAccountStore((s) => s.setError);

  // console.log("SDK init");
  const getUserInfo = async () => {
    try {
      setLoading(true);
      const userInfo = await SdkService.getUsersInfo();
      const accountInfo = userInfo || {
        address: "TGSzZGCTaYjjmMZontBcdi3M9EToS5ztEp",
        signature: {
          nonce: "date=2025-08-14T15:16:27.405Z,exp=1280,s=6d757369632e617070",
          signature:
            "b746eaa43cb2ed62414d49751f7d39027ab9e9978602a2c8a4c8a6310c1e1f8b2914d3164c6115c58ae5c2fccadc8ca6f9347c22666fe485e0f724bc51397b65",
          pubkey:
            "0356e28a68df38b8fb2fd0bed0ccba21139fb5097cdfe34aba6aca40acac5b10c0",
          address: "TGSzZGCTaYjjmMZontBcdi3M9EToS5ztEp",
          v: 1,
        },
        status: "registered",
      };
      setFromSdk(accountInfo as SdkUserInfo);
    } catch (e) {
      console.error(e);
      setError(e?.message ?? "Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  };

  const init = async () => {
    const sdkInfo = await SdkService.init();
    console.log("sdk info", sdkInfo);
  };

  useEffect(() => {
    (async () => {
      await SdkService.init();
      await SdkService.requestPermissions();
      await getUserInfo();
      // Optional extras you had:
      void SdkService.getAppInfo();
      void SdkService.showHelperMessage("test helper message");
      void SdkService.getUserState();
    })();
  }, []);

  return <>{children}</>;
};
