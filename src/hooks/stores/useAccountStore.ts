// src/hooks/stores/useAccountStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Shape of what the SDK can return (adjust if your SdkService differs)
export type SdkUserInfo = {
  address: string | null;
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
  address: string | null;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  avatarFile?: File | null;
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
  isDirty: {
    username: boolean;
    bio: boolean;
    avatar: boolean;
  };
  serverSnapshot: Partial<Profile> | null;

  // actions
  setLoading: (loading: boolean) => void;
  setError: (msg: string | null) => void;

  setAddress: (addr: string | null) => void;
  setSignature: (sig: AccountState["signature"]) => void;
  setStatus: (status?: string) => void;

  setProfile: (p: Profile) => void;
  patchProfile: (p: Partial<Profile>) => void;
  setFromServer: (p: Partial<Profile>) => void;
  resetToServer: () => void;

  /** One-shot: map SDK user info into the store */
  // setFromSdk: (sdk: SdkUserInfo) => void;

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
      //
      isDirty: { username: false, bio: false, avatar: false },
      serverSnapshot: null,
      // ui flags
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // base setters
      setAddress: (address) => set({ address }),
      setSignature: (signature) => set({ signature }),
      setStatus: (status) => set({ status }),

      // profile setters
      setFromServer: (p: Partial<Profile>) => {
        const { isDirty, profile } = get();
        // Only overwrite fields that are NOT dirty
        const merged: Profile = {
          ...(profile ?? {}),
          ...p,
          username: isDirty.username ? profile?.username : p.username,
          bio: isDirty.bio ? profile?.bio : p.bio,
          avatarUrl: isDirty.avatar ? profile?.avatarUrl : p.avatarUrl,
        };
        set({ profile: merged, serverSnapshot: p });
      },

      resetToServer: () => {
        const snap = get().serverSnapshot;
        if (snap) {
          set({
            profile: { ...snap, avatarFile: null } as Profile,
            isDirty: { username: false, bio: false, avatar: false },
          });
        }
      },

      setProfile: (profile) => {
        console.log("set profile", profile);
        set({ profile });
      },

      patchProfile: (patch) => {
        // console.log("patch profile", patch);
        set({ profile: { ...get().profile, ...patch } });
      },

      clear: () =>
        set({
          address: null,
          status: undefined,
          signature: undefined,
          profile: initialProfile,
          loading: false,
          error: null,
          serverSnapshot: null,
          isDirty: { username: false, bio: false, avatar: false },
        }),
    }),
    {
      name: "account-store", // localStorage key
      storage: createJSONStorage(() => sessionStorage),
      // Persist only what you actually need between reloads
      partialize: (state) => ({
        address: state.address,
        status: state.status,
        signature: state.signature,
        profile: state.profile,
        serverSnapshot: state.serverSnapshot,
        isDirty: state.isDirty,
      }),
    },
  ),
);
