// src/pages/Account.tsx
import { useEffect, useRef, useState } from "react";
import { useAccountStore } from "../hooks/stores/useAccountStore";
// import { SdkService } from "../bastyon-sdk/sdkService"; // <-- wire if you have it
// import EditIcon from "../assets/icons/edit.svg?react";
// import CheckIcon from "../assets/icons/check.svg?react";

type ProfileData = {
  publicKey: string;
  username: string;
  bio: string;
  avatarUrl?: string; // existing
};

export default function Account() {
  const address = useAccountStore((s) => s.address);
  const profile = useAccountStore((s) => s.profile);
  const patchProfile = useAccountStore((s) => s.patchProfile);
  const setProfile = useAccountStore((s) => s.setProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [publicKey, setPublicKey] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  // new upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TODO: Replace with your real loaders (from SDK or API)
  async function loadProfile(): Promise<ProfileData> {
    // Example using your SDK (uncomment + adapt):
    // const info = await SdkService.getUsersInfo();
    // return {
    //   publicKey: info?.publicKey ?? "",
    //   username: info?.username ?? "",
    //   bio: info?.bio ?? "",
    //   avatarUrl: info?.avatarUrl,
    // };

    // Temporary mock:
    return {
      publicKey: "PK_abc123…your_users_public_key_here",
      username: "your_username",
      bio: "Short about-me goes here.",
      avatarUrl:
        "https://avatars.githubusercontent.com/u/9919?v=4" /* any fallback */,
    };
  }

  // TODO: Replace with your real saver (to SDK/backend)
  async function saveProfile(payload: {
    username: string;
    bio: string;
    avatarFile?: File | null;
  }) {
    // Example with SDK:
    // await SdkService.updateProfile(payload);

    console.log(payload);
    // Demo delay:
    await new Promise((r) => setTimeout(r, 600));
  }

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const p = await loadProfile();
        if (!active) return;
        setPublicKey(p.publicKey);
        setUsername(p.username ?? "");
        setBio(p.bio ?? "");
        setAvatarUrl(p.avatarUrl);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
  };

  const onSave = async () => {
    // simple client-side validation
    if (!username.trim()) {
      alert("Please enter a username.");
      return;
    }
    if (username.length > 30) {
      alert("Username is too long (max 30).");
      return;
    }
    if (bio.length > 300) {
      alert("Bio is too long (max 300).");
      return;
    }

    setSaving(true);
    try {
      await saveProfile({
        username: username.trim(),
        bio,
        avatarFile, // send file if present
      });
      // If your backend returns a new avatar URL, set it here.
      if (avatarFile && avatarPreview) {
        setAvatarUrl(avatarPreview);
        // Note: in a real app, prefer the server’s canonical URL rather than the blob preview.
      }
      setProfile({ ...profile });
      alert("Profile saved!");
    } catch (e) {
      console.error(e);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-300">
        Loading account…
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Account</h1>

      {/* Public key (read-only) */}
      <section className="bg-[#2D0F3A] rounded-xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">{address}</h2>
        <div className="flex items-start gap-3">
          <code className="break-all text-sm opacity-90">{publicKey}</code>
          <button
            onClick={() => navigator.clipboard.writeText(publicKey)}
            className="ml-auto text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded"
          >
            Copy
          </button>
        </div>
      </section>

      {/* Profile form */}
      <section className="bg-[#2D0F3A] rounded-xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>

        {/* Avatar uploader */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img
              src={avatarPreview ?? avatarUrl}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border border-white/10"
            />
            {/* Optional badge if using preview */}
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
            {avatarPreview && (
              <button
                onClick={clearAvatar}
                className="bg-white/10 text-sm px-3 py-2 rounded hover:bg-white/20"
              >
                Remove preview
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        </div>

        {/* Username */}
        <label className="block mb-4">
          <span className="block text-sm mb-2 opacity-90">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={30}
            placeholder="Choose a username"
            className="w-full rounded-lg bg-[#55356B] px-3 py-2 outline-none placeholder-white/60"
          />
          <span className="text-xs opacity-60">{username.length}/30</span>
        </label>

        {/* Bio */}
        <label className="block">
          <span className="block text-sm mb-2 opacity-90">About you</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={300}
            placeholder="Tell others about yourself…"
            className="w-full rounded-lg bg-[#55356B] px-3 py-2 outline-none placeholder-white/60 resize-y"
          />
          <span className="text-xs opacity-60">{bio.length}/300</span>
        </label>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => {
            // reset to loaded values (optional)
            setAvatarFile(null);
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
          }}
          className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
        >
          Reset edits
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 rounded bg-[#B059F6] hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
