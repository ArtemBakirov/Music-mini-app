import { create } from "zustand";

type AccountInfo = {
  address: string;
  signature: {
    pubkey: string;
  };
  status?: string;
};

type AuthState = {
  user: {
    address: string;
    pubkey: string;
  } | null;
  setUser: (accountInfo: AccountInfo) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (accountInfo) =>
    set({
      user: {
        address: accountInfo.address,
        pubkey: accountInfo.signature.pubkey,
      },
    }),
  clearUser: () => set({ user: null }),
}));
