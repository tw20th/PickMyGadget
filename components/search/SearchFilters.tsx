"use client";

import { MonitoredItem } from "@/types/item";

type Props = {
  keyword: string;
  items: MonitoredItem[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
};

export const SearchFilters = ({
  items,
  selectedTag,
  setSelectedTag,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  // 全タグとカテゴリを抽出
  const allTags = Array.from(new Set(items.flatMap((item) => item.tag ?? [])));
  const allCategories = Array.from(
    new Set(
      items
        .map((item) => item.category ?? null)
        .filter((v): v is string => v !== null)
    )
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* タグ選択 */}
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`px-3 py-1 text-xs rounded-full border ${
              selectedTag === tag
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* カテゴリ選択 */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 text-xs rounded-full border ${
              selectedCategory === cat
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? null : cat)
            }
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
