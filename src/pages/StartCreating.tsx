import { useEffect, useMemo, useState } from "react";

type Project = { id: string; name: string };
type Album = { id: string; name: string; coverUrl?: string };

type TrackPick = {
  file: File;
  status: "queued" | "uploading" | "done" | "error";
  progress: number; // 0-100
  result?: { cid: string; http: string };
  error?: string;
};

const API_BASE = "http://localhost:8080";

async function apiGet<T>(path: string): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}

async function apiPostJson<T>(path: string, body: any): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function apiPostForm<T>(
  path: string,
  form: FormData,
  onProgress?: (pct: number) => void,
): Promise<T> {
  // Native fetch has no progress; for real progress use XHR
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}${path}`);
    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300)
        resolve(JSON.parse(xhr.responseText));
      else reject(new Error(xhr.responseText || `HTTP ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(form);
  });
}

export default function StartCreating() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [newProjectName, setNewProjectName] = useState("");

  const [useAlbum, setUseAlbum] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumCover, setNewAlbumCover] = useState<File | null>(null);
  const [createdAlbum, setCreatedAlbum] = useState<Album | null>(null);

  const [tracks, setTracks] = useState<TrackPick[]>([]);
  const [artist, setArtist] = useState<string>(""); // optional default artist

  const canUpload = useMemo(() => {
    return (
      !!selectedProjectId &&
      tracks.length > 0 &&
      tracks.every(
        (t) =>
          t.status === "queued" || t.status === "error" || t.status === "done",
      )
    );
  }, [selectedProjectId, tracks]);

  // Load projects on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<{ items: Project[] }>("/projects");
        setProjects(data.items);
        if (data.items.length) setSelectedProjectId(data.items[0].id);
      } catch {
        /* ignore for first run */
      }
    })();
  }, []);

  // (Optional) Load albums when project changes (if you plan a GET /albums?projectId=)
  useEffect(() => {
    (async () => {
      setAlbums([]);
      setSelectedAlbumId("");
      setCreatedAlbum(null);
      if (!selectedProjectId) return;
      try {
        const data = await apiGet<{ items: Album[] }>(
          `/albums?projectId=${selectedProjectId}`,
        );
        setAlbums(data.items);
        if (data.items.length) setSelectedAlbumId(data.items[0].id);
      } catch {
        /* ignore; you may not have this endpoint yet */
      }
    })();
  }, [selectedProjectId]);

  function onPickTracks(files: FileList | null) {
    if (!files || !files.length) return;
    const picked: TrackPick[] = Array.from(files).map((f) => ({
      file: f,
      progress: 0,
      status: "queued",
    }));
    setTracks((prev) => [...prev, ...picked]);
  }

  async function handleCreateProject() {
    if (!newProjectName.trim()) return;
    const created = await apiPostJson<Project>("/projects", {
      name: newProjectName.trim(),
    });
    setProjects((p) => [created, ...p]);
    setSelectedProjectId(created.id);
    setNewProjectName("");
  }

  async function ensureAlbum(): Promise<Album | null> {
    if (!useAlbum) return null;

    // If choosing existing
    if (selectedAlbumId) {
      const found =
        albums.find((a) => a.id === selectedAlbumId) || createdAlbum;
      return found ?? null;
    }

    // Else create new
    if (!newAlbumName.trim()) return null;
    const form = new FormData();
    form.append("name", newAlbumName.trim());
    form.append("projectId", selectedProjectId);
    if (newAlbumCover) form.append("cover", newAlbumCover);

    const created = await apiPostForm<Album>("/albums", form);
    setAlbums((arr) => [created, ...arr]);
    setCreatedAlbum(created);
    setSelectedAlbumId(created.id);
    return created;
  }

  async function uploadOneTrack(
    tp: TrackPick,
    album: Album | null,
  ): Promise<TrackPick> {
    const updated: TrackPick = { ...tp, status: "uploading", progress: 0 };
    setTracks((prev) => prev.map((t) => (t === tp ? updated : t)));

    try {
      // 1) Upload file to encrypted storage
      const form = new FormData();
      form.append("file", tp.file);
      const up = await apiPostForm<{
        cid: string;
        http: string;
        ipfs: string;
        name: string;
        encrypted: boolean;
      }>("/uploads/encrypted", form, (pct) => {
        setTracks((prev) =>
          prev.map((t) =>
            t === tp ? { ...t, progress: pct, status: "uploading" } : t,
          ),
        );
      });

      // 2) Create song metadata
      await apiPostJson("/songs", {
        cid: up.cid,
        title: tp.file.name.replace(/\.[^.]+$/, ""),
        artist: artist || undefined,
        album: album?.name,
        projectId: selectedProjectId,
        bytes: tp.file.size,
        mime: tp.file.type || "audio/mpeg",
        isEncrypted: true,
      });

      const done: TrackPick = {
        ...tp,
        status: "done",
        progress: 100,
        result: { cid: up.cid, http: up.http },
      };
      setTracks((prev) => prev.map((t) => (t === tp ? done : t)));
      return done;
    } catch (e: any) {
      const err: TrackPick = {
        ...tp,
        status: "error",
        error: e?.message || "Upload failed",
      };
      setTracks((prev) => prev.map((t) => (t === tp ? err : t)));
      return err;
    }
  }

  async function handleUploadAll() {
    if (!selectedProjectId || tracks.length === 0) return;
    const album = await ensureAlbum(); // create (if needed) before uploading
    for (const tp of tracks) {
      if (tp.status === "done") continue;
      // eslint-disable-next-line no-await-in-loop
      await uploadOneTrack(tp, album);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Upload your music</h1>

      {/* Project selector / creator */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          1) Choose or create a Music Project
        </h2>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-sm mb-1">Existing project</label>
            <select
              className="block w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="" disabled>
                Select project…
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <div>
              <label className="block text-sm mb-1">New project name</label>
              <input
                className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="My new project"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <button
              onClick={handleCreateProject}
              className="h-10 px-4 rounded-lg bg-black text-white text-sm"
              disabled={!newProjectName.trim()}
            >
              Create
            </button>
          </div>
        </div>
      </section>

      {/* Tracks picker */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">2) Select tracks to upload</h2>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={(e) => onPickTracks(e.target.files)}
            className="text-sm"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Default artist (optional):
            </span>
            <input
              className="rounded border border-gray-300 px-2 py-1 text-sm"
              placeholder="Artist name"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>
        </div>

        {/* Track list */}
        <ul className="divide-y">
          {tracks.map((t, idx) => (
            <li key={idx} className="py-3 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{t.file.name}</div>
                <div className="text-xs text-gray-500">
                  {(t.file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <div className="flex items-center gap-3">
                {t.status === "uploading" && (
                  <div className="w-40 h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-black rounded"
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                )}
                <span
                  className={
                    t.status === "done"
                      ? "text-green-600 text-sm"
                      : t.status === "error"
                        ? "text-red-600 text-sm"
                        : "text-gray-600 text-sm"
                  }
                >
                  {t.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Album (optional) */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">3) Optional: add to album</h2>

        <div className="flex items-start gap-6">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={useAlbum}
              onChange={(e) => setUseAlbum(e.target.checked)}
            />
            <span className="text-sm">Use album</span>
          </label>

          {useAlbum && (
            <div className="flex flex-col gap-4">
              {/* Existing album */}
              {albums.length > 0 && (
                <div>
                  <div className="text-sm mb-1">Choose existing album</div>
                  <select
                    className="block w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    value={selectedAlbumId}
                    onChange={(e) => setSelectedAlbumId(e.target.value)}
                  >
                    <option value="">— Create new —</option>
                    {albums.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Create new album */}
              {!selectedAlbumId && (
                <div className="flex items-end gap-3">
                  <div>
                    <div className="text-sm mb-1">New album name</div>
                    <input
                      className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="My Album"
                      value={newAlbumName}
                      onChange={(e) => setNewAlbumName(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="text-sm mb-1">Cover image</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setNewAlbumCover(e.target.files?.[0] ?? null)
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Upload button */}
      <section className="flex items-center gap-3">
        <button
          className="px-5 py-2 rounded-lg bg-black text-white disabled:bg-gray-300"
          disabled={!canUpload}
          onClick={handleUploadAll}
        >
          4) Upload tracks
        </button>
        <span className="text-sm text-gray-600">
          Tracks will be uploaded to Lighthouse (encrypted) and metadata saved
          to MongoDB.
        </span>
      </section>
    </div>
  );
}
