// components/common/PopularTags.tsx
"use client";

import Link from "next/link";
import { useTagCounts } from "@/hooks/useTagCounts";

export const PopularTags = () => {
  const tagList = useTagCounts();

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">人気タグから探す</h2>
      <div className="flex flex-wrap gap-2">
        {tagList.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tag/${encodeURIComponent(tag)}`}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
          >
            #{tag}（{count}）
          </Link>
        ))}
      </div>
    </div>
  );
};
