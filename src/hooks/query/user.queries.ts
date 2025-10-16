// src/hooks/query/users.queries.ts
import { useEffect, useState } from "react";
import apiInstance from "../../utils/axios.ts";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Profile, useAccountStore } from "../stores/useAccountStore.ts";

const setProfile = useAccountStore.getState().setProfile;

export type UserDto = {
  address: string;
  username?: string;
  bio?: string;
  avatarUrl?: string | null; // served by GET /api/users/:address (controller builds it)
  createdAt?: string;
  updatedAt?: string;
};

// ---- Config ----
// const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || ""; // e.g. "https://your-api.com"

// ---- Cache keys ----
const userKeys = {
  all: ["users"] as const,
  byAddress: (address: string) => [...userKeys.all, address] as const,
  avatar: (address: string) =>
    [...userKeys.byAddress(address), "avatar"] as const,
};

// ---- Fetchers ----
async function fetchUser(address: string): Promise<UserDto> {
  console.log("fetching user for address", address);
  const res = await apiInstance.get(`/users/${encodeURIComponent(address)}`);
  console.log("fetched user res data", res.data);
  /*if (!res.data.ok) {
    if (res.status === 404) throw new Error("User not found");
    throw new Error(`Failed to fetch user (${res.status})`);
  }*/
  //const data = await res.data.json();
  // controller returned { user: {...} } in previous example, but your class version returns the raw doc.
  // Support both shapes:
  return res.data as UserDto;
}

export type UpsertInput =
  | {
      address: string;
      username?: string;
      bio?: string;
      avatarFile?: File | null; // optional
    }
  | FormData;

/**
 * Accepts either:
 *  - a plain object { address, username, bio, avatarFile }
 *  - a prebuilt FormData (with fields: address, username, bio, avatar)
 */
async function upsertUser(input: UpsertInput): Promise<UserDto> {
  console.log("upsert user");
  let body: BodyInit;
  // let headers: HeadersInit | undefined;

  if (input instanceof FormData) {
    body = input;
  } else {
    const fd = new FormData();
    fd.append("address", input.address);
    fd.append("username", input.username!);
    if (input.bio) fd.append("bio", input.bio);
    if (input.avatarFile) fd.append("avatar", input.avatarFile);
    body = fd;
  }
  const res = await apiInstance.post("/users", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!res.data.ok) {
    const msg = await res.data.text().catch(() => "");
    throw new Error(
      `Failed to save user (${res.status}): ${msg || res.statusText}`,
    );
  }
  const data = await res.data.json();
  return data as UserDto;
}

// ---- Hooks ----
export function useUser(address?: string, enabled = true) {
  return useQuery({
    queryKey: address ? userKeys.byAddress(address) : userKeys.all,
    queryFn: () => {
      if (!address) throw new Error("Address is required");
      return fetchUser(address);
    },
    enabled: Boolean(address && enabled),
    staleTime: 60_000, // 1 minute
  });
}

export function useHydratedUser(address?: string) {
  console.log("user hydrated user for address", address);
  const setFromServer = useAccountStore((s) => s.setFromServer);

  const q = useQuery({
    queryKey: address ? userKeys.byAddress(address) : userKeys.all,
    queryFn: async () => {
      if (!address) return null;
      return await fetchUser(address);
    },
    enabled: Boolean(address),
  });
  console.log("query q", q);

  // hydrate store when fresh data arrives
  useEffect(() => {
    if (q.data && address) {
      // console.log("useEffect setFromServer", q.data, address);
      setFromServer(q.data as Partial<Profile>);
    }
  }, [q.data, address, setFromServer]);

  return q;
}

export function useUpsertUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertUser,
    onSuccess: async (user) => {
      if (user?.address) {
        setProfile(user as Profile);
        qc.setQueryData(userKeys.byAddress(user.address), user);
        // bust avatar query (so it refetches if image changed)
        await qc.invalidateQueries({ queryKey: userKeys.all });
      }
    },
  });
}

/**
 * Returns a browser object URL for the avatar (or null if none).
 * Auto-revokes object URL on unmount/change to avoid leaks.
 */
export function useUserAvatar(address?: string) {
  const query = useQuery({
    queryKey: address ? userKeys.avatar(address) : userKeys.all,
    queryFn: async () => {
      if (!address) throw new Error("Address is required");
      return fetchUserAvatarBlob(address);
      // const blob = await fetchUserAvatarBlob(address);

      // const addressUrl = URL.createObjectURL(blob);

      // return addressUrl;
    },
    enabled: Boolean(address),
    staleTime: 60_000,
  });

  // Revoke on unmount / change
  /*useEffect(() => {
    const url = query.data;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [query.data]);*/

  return query; // { data: string | undefined, ... }
}

export function useObjectUrl(blob?: Blob) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (!blob) {
      setUrl(undefined);
      return;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u); // revoke THIS url when blob changes/unmounts
  }, [blob]);
  return url;
}

async function fetchUserAvatarBlob(address: string): Promise<Blob> {
  const res = await fetch(
    `${apiInstance.getUri()}/users/${encodeURIComponent(address)}/avatar`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "Avatar not found"
        : `Failed to fetch avatar (${res.status})`,
    );
  }
  return await res.blob();
}

// ---- Optional: helper to optimistically update username/bio only ----
export function primeUserCacheAfterLocalEdit(
  qc: QueryClient,
  address: string,
  partial: Partial<Pick<UserDto, "username" | "bio">>,
) {
  qc.setQueryData(userKeys.byAddress(address), (prev: UserDto | undefined) =>
    prev ? { ...prev, ...partial, updatedAt: new Date().toISOString() } : prev,
  );
}

// --- Mutation to save current store state to server ---
export function useSaveProfile() {
  const qc = useQueryClient();
  const profile = useAccountStore((s) => s.profile);
  const setFromServer = useAccountStore((s) => s.setFromServer);

  return useMutation({
    mutationFn: async () => {
      // const p = getProfile;
      if (!profile || !profile.address)
        throw new Error("No profile/address to save");
      return await upsertUser({
        address: profile.address,
        username: profile?.username,
        bio: profile.bio,
        avatarFile: profile.avatarFile ?? null,
      });
    },
    onSuccess: (saved) => {
      setFromServer(saved as Partial<Profile>); // clears dirty flags via store logic
      qc.setQueryData(userKeys.byAddress(saved.address), saved);
    },
  });
}
