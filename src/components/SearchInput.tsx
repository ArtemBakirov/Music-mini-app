import Search from "../assets/icons/search.svg?react";
import { Source, useSourceStore } from "../hooks/stores/useSourceStore";

export const SearchInput = ({
  query,
  setQuery,
  onClick,
}: {
  query: string;
  setQuery: (val: string) => void;
  onClick: () => void;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onClick();
    }
  };
  const source = useSourceStore((s) => s.source);
  const setSource = useSourceStore((s) => s.setSource);

  // const [source, setSource] = useState<Source>("jamendo");

  const handleSourceChange = (source: Source) => {
    // console.log("change source", source);
    setSource(source);
  };

  return (
    <div className="flex gap-6 w-full mb-4">
      <div className="relative bg-[#55356B] rounded-3xl w-full">
        <div
          onClick={onClick}
          className={
            "cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-xl"
          }
        >
          <Search className={"text-white hover:text-gray-300"} />
        </div>
        <input
          type="text"
          placeholder="Search anything..."
          value={query}
          onKeyDown={handleKeyDown}
          onChange={(e) => setQuery(e.target.value)}
          className=" bg-[#55356B] text-white pl-12 pr-4 py-2 rounded-3xl w-full placeholder-white/60 focus:outline-none"
        />
      </div>
      <div className="w-64">
        <select
          id="music-source"
          name="music-source"
          value={source}
          onChange={(e) => handleSourceChange(e.target.value as Source)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none"
        >
          <option value="jamendo">Jamendo</option>
          <option value="youtube">YouTube</option>
          <option value="bastyon music">Bastyon music</option>
        </select>
      </div>
    </div>
  );
};
