"use client";

export type SortOption = "score" | "price";

type Props = {
  sort: SortOption;
  setSort: (value: SortOption) => void;
};

export const SortSelector = ({ sort, setSort }: Props) => {
  return (
    <div className="flex gap-4 items-center">
      <span className="text-sm text-gray-600">並び順:</span>
      <button
        onClick={() => setSort("score")}
        className={`px-3 py-1 text-sm rounded-lg border ${
          sort === "score"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        スコア順
      </button>
      <button
        onClick={() => setSort("price")}
        className={`px-3 py-1 text-sm rounded-lg border ${
          sort === "price"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        価格順
      </button>
    </div>
  );
};
