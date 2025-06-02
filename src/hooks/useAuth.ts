import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { SdkService } from "../bastyon-sdk/sdkService";

export const useAuth = () => {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await SdkService.init(); // Ensure SDK is ready
        await SdkService.requestPermissions(); // Request "account" permission
        const account = await SdkService.getUsersInfo();
        if (account) setUser(account);
      } catch (err) {
        console.warn("Bastyon user not available:", err);
      }
    };

    // Only try fetching if not already set
    if (!user) fetchUser();
  }, [user, setUser]);

  return { user };
};
