"use client";

type SortKey = "score" | "price";

type Props = {
  sortKey: SortKey;
  onChange: (key: SortKey) => void;
};

export const SortToggle = ({ sortKey, onChange }: Props) => {
  return (
    <div className="flex gap-2 text-sm text-gray-700 mb-4">
      <span>並び替え:</span>
      <button
        onClick={() => onChange("score")}
        className={`px-2 py-1 rounded-md ${
          sortKey === "score" ? "bg-blue-100 font-bold" : "hover:underline"
        }`}
      >
        スコア順
      </button>
      <button
        onClick={() => onChange("price")}
        className={`px-2 py-1 rounded-md ${
          sortKey === "price" ? "bg-blue-100 font-bold" : "hover:underline"
        }`}
      >
        価格順
      </button>
    </div>
  );
};
