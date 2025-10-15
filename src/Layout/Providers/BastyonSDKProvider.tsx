import { SdkService } from "../../bastyon-sdk/sdkService.ts";
import { ReactNode, useEffect, useState } from "react";
import { useAccountStore } from "../../hooks/stores/useAccountStore";

export const BastyonSDKProvider = ({ children }: { children: ReactNode }) => {
  // const setFromSdk = useAccountStore((s) => s.setFromSdk);
  const setLoading = useAccountStore((s) => s.setLoading);
  const setError = useAccountStore((s) => s.setError);
  const patchProfile = useAccountStore((s) => s.patchProfile);
  const [initialized, setInitialized] = useState<boolean>(false);
  // console.log("SDK init");
  const getUserAddress = async () => {
    console.log("get user address");
    try {
      setLoading(true);
      const inBastyon = SdkService.inBastyon();
      console.log("inBastyon", inBastyon);

      let userInfo;
      if (inBastyon) {
        userInfo = await SdkService.getUsersInfo();
      } else {
        console.log("setting default");
        userInfo = {
          address: "TGSzZGCTaYjjmMZontBcdi3M9EToS5ztEp",
          signature: {
            nonce:
              "date=2025-08-14T15:16:27.405Z,exp=1280,s=6d757369632e617070",
            signature:
              "b746eaa43cb2ed62414d49751f7d39027ab9e9978602a2c8a4c8a6310c1e1f8b2914d3164c6115c58ae5c2fccadc8ca6f9347c22666fe485e0f724bc51397b65",
            pubkey:
              "0356e28a68df38b8fb2fd0bed0ccba21139fb5097cdfe34aba6aca40acac5b10c0",
            address: "TGSzZGCTaYjjmMZontBcdi3M9EToS5ztEp",
            v: 1,
          },
          status: "registered",
        };
      }

      // console.log("patch address from sdk", userInfo?.address);
      console.log("patch profile with", userInfo?.address);
      patchProfile({ address: userInfo?.address });
    } catch (e) {
      console.error(e);
      setError(e?.message ?? "Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect sdk provider");
    (async () => {
      await SdkService.init()
        .then((info) => {
          console.log("app info", info);
          setInitialized(true);
        })
        .catch((e) => {
          console.error("failed init", e);
        });
      // await SdkService.requestPermissions();
      // Optional extras you had:
      void SdkService.getAppInfo();
      // void SdkService.showHelperMessage("test helper message");
      void SdkService.getUserState();
    })();
    console.log("get address");
    void getUserAddress();
  }, []);

  return <>{children}</>;
};
