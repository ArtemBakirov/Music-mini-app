// src/hooks/stores/useAccountStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Shape of what the SDK can return (adjust if your SdkService differs)
export type SdkUserInfo = {
  address: string;
  status?: string;
  signature?: {
    nonce: string;
    signature: string;
    pubkey: string;
    address: string;
    v: number;
  };
  // If your SDK already returns these, great; otherwise we’ll store our own.
  username?: string;
  bio?: string;
  avatarUrl?: string;
};

export type Profile = {
  username: string;
  bio: string;
  avatarUrl?: string;
};

type AccountState = {
  // data
  address: string | null;
  status?: string; // e.g. "registered"
  signature?: SdkUserInfo["signature"];
  profile: Profile;

  // ui flags
  loading: boolean;
  error?: string | null;

  // actions
  setLoading: (loading: boolean) => void;
  setError: (msg: string | null) => void;

  setAddress: (addr: string | null) => void;
  setSignature: (sig: AccountState["signature"]) => void;
  setStatus: (status?: string) => void;

  setProfile: (p: Profile) => void;
  patchProfile: (p: Partial<Profile>) => void;

  /** One-shot: map SDK user info into the store */
  setFromSdk: (sdk: SdkUserInfo) => void;

  /** Clear everything (e.g., on logout) */
  clear: () => void;
};

const initialProfile: Profile = { username: "", bio: "", avatarUrl: undefined };

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      // initial state
      address: null,
      status: undefined,
      signature: undefined,
      profile: initialProfile,
      loading: false,
      error: null,

      // ui flags
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // base setters
      setAddress: (address) => set({ address }),
      setSignature: (signature) => set({ signature }),
      setStatus: (status) => set({ status }),

      // profile setters
      setProfile: (profile) => set({ profile }),
      patchProfile: (patch) => set({ profile: { ...get().profile, ...patch } }),

      // map SDK to store
      setFromSdk: (sdk) => {
        set({
          address: sdk.address ?? null,
          status: sdk.status,
          signature: sdk.signature,
          profile: {
            username: sdk.username ?? get().profile.username ?? "",
            bio: sdk.bio ?? get().profile.bio ?? "",
            avatarUrl: sdk.avatarUrl ?? get().profile.avatarUrl,
          },
        });
      },

      clear: () =>
        set({
          address: null,
          status: undefined,
          signature: undefined,
          profile: initialProfile,
          loading: false,
          error: null,
        }),
    }),
    {
      name: "account-store", // localStorage key
      // Persist only what you actually need between reloads
      partialize: (state) => ({
        address: state.address,
        status: state.status,
        signature: state.signature,
        profile: state.profile,
      }),
    },
  ),
);
