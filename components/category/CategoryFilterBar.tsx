// components/category/CategoryFilterBar.tsx
"use client";

import Link from "next/link";

type Props = {
  items: { tag: string; count: number }[];
  active?: string;
  type: "tag" | "category";
};

export const CategoryFilterBar = ({ items, active, type }: Props) => {
  return (
    <div className="flex overflow-x-auto gap-2 pb-2">
      {items.map(({ tag, count }) => (
        <Link
          key={tag}
          href={`/${type}/${encodeURIComponent(tag)}`}
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border transition ${
            tag === active
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          #{tag} ({count})
        </Link>
      ))}
    </div>
  );
};
