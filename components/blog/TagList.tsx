"use client";

type TagListProps = {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
};

export const TagList = ({ tags, selected, onSelect }: TagListProps) => {
  // ✅ タグの件数をカウント
  const tagCounts: Record<string, number> = {};
  tags.forEach((tag) => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });

  const uniqueTags = Object.keys(tagCounts);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex flex-nowrap gap-2 w-max">
        <button
          onClick={() => onSelect(null)}
          className={`px-3 py-1 whitespace-nowrap rounded-full border text-sm ${
            selected === null
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          すべて
        </button>
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className={`px-3 py-1 whitespace-nowrap rounded-full border text-sm ${
              selected === tag
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            #{tag} ({tagCounts[tag]})
          </button>
        ))}
      </div>
    </div>
  );
};
