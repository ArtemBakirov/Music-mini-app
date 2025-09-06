import { useState } from "react";

export function SearchYoutubeInput({
  initial = "",
  onSubmit,
}: {
  initial?: string;
  onSubmit: (q: string) => void;
}) {
  const [q, setQ] = useState(initial);

  return (
    <div className="flex gap-2">
      <input
        className="w-full rounded-md px-3 py-2 bg-[#1f1f1f] text-white"
        placeholder="Search YouTube…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit(q)}
      />
      <button
        className="px-4 py-2 rounded-md bg-[#B065A0] text-white"
        onClick={() => onSubmit(q)}
      >
        Search
      </button>
    </div>
  );
}
