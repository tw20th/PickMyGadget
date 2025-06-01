"use client";

type Props = {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
};

export const RankingFilterBar = ({ tags, selected, onSelect }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 text-sm mb-4">
      <button
        onClick={() => onSelect(null)}
        className={`px-2 py-1 rounded-md ${
          selected === null ? "bg-green-100 font-bold" : "hover:underline"
        }`}
      >
        すべて
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className={`px-2 py-1 rounded-md ${
            selected === tag ? "bg-green-100 font-bold" : "hover:underline"
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
};
