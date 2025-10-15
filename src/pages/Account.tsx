import { useRef, useState } from "react";
import { useAccountStore } from "../hooks/stores/useAccountStore";
import { useObjectUrl } from "../hooks/query/user.queries.ts";
import {
  UpsertInput,
  useUpsertUser,
  useUserAvatar,
  useHydratedUser,
} from "../hooks/query/user.queries.ts";
import noImage from "../assets/picture/no_image.png";

export default function Account() {
  const profile = useAccountStore((s) => s.profile);
  console.log("account", profile);
  const patchProfile = useAccountStore((s) => s.patchProfile);

  const { isLoading, isError } = useHydratedUser(profile.address || "");

  // new upload
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // react-query
  const { status, mutate, error } = useUpsertUser();
  const { data: avatar, isError: avatarIsError } = useUserAvatar(
    profile.address || "",
  );
  const avatarUrl = useObjectUrl(avatar);

  console.log("avatar", avatar);

  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] || null;
    patchProfile({ avatarFile: file });
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      console.log("no file", avatarPreview);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
  };

  const onSave = async () => {
    const fd = new FormData();
    fd.append("address", profile.address || "");
    if (profile.username) fd.append("username", profile.username);
    if (profile.bio) fd.append("bio", profile.bio);
    if (profile.avatarFile) fd.append("avatarFile", profile.avatarFile);

    try {
      mutate(fd as UpsertInput);
    } catch (e) {
      console.error(e);
      console.error("Failed to save profile.", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-300">
        Loading account…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-300">
        Error loading account.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 text-white border-purple-600 border-2">
      <h1 className="text-2xl font-bold mb-6">Account</h1>

      {/* Public key (read-only) */}
      {
        <section className="bg-[#2D0F3A] rounded-xl p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2 min-w-0 basis-0 truncate text-wrap">
            {profile.address}
          </h2>
          <div className="flex items-start gap-3">
            <button
              onClick={() =>
                navigator.clipboard.writeText(profile.address || "")
              }
              className="ml-auto text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded"
            >
              Copy
            </button>
          </div>
        </section>
      }

      {/* Profile form */}
      <section className="bg-[#2D0F3A] rounded-xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>

        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            {!avatarIsError ? (
              <img
                src={avatarPreview ?? avatarUrl}
                alt="avatar"
                className="w-36 h-36 rounded-full object-cover border border-white/10"
              />
            ) : (
              <img
                className={"w-36 h-36 rounded-full"}
                src={noImage}
                alt={"no image"}
              />
            )}

            {avatarPreview && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded">
                preview
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onPickFile}
              className="bg-white text-black text-sm px-3 py-2 rounded hover:opacity-90"
            >
              Upload new…
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        </div>

        <label className="block mb-4">
          <span className="block text-sm mb-2 opacity-90">Username</span>
          <input
            value={profile?.username}
            onChange={(e) => patchProfile({ username: e.target.value })}
            maxLength={30}
            placeholder="Choose a username"
            className="w-full rounded-lg bg-[#55356B] px-3 py-2 outline-none placeholder-white/60"
          />
          <span className="text-xs opacity-60">
            {profile.username?.length}/30
          </span>
        </label>

        <label className="block">
          <span className="block text-sm mb-2 opacity-90">About you</span>
          <textarea
            value={profile?.bio}
            onChange={(e) => patchProfile({ bio: e.target.value })}
            rows={4}
            maxLength={300}
            placeholder="Tell others about yourself…"
            className="w-full rounded-lg bg-[#55356B] px-3 py-2 outline-none placeholder-white/60 resize-y"
          />
          <span className="text-xs opacity-60">{profile.bio?.length}/300</span>
        </label>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onSave}
          disabled={status === "pending"}
          className="px-4 py-2 rounded bg-[#B059F6] hover:opacity-90 disabled:opacity-60"
        >
          {status === "pending" ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
