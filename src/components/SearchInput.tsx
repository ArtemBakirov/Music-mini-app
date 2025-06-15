import Search from "../assets/icons/search.svg?react";

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

  return (
    <div className="relative w-full mb-4">
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
        placeholder="Search music..."
        value={query}
        onKeyDown={handleKeyDown}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-[#55356B] text-white pl-12 pr-4 py-2 rounded-3xl w-full placeholder-white/60 focus:outline-none"
      />
    </div>
  );
};
