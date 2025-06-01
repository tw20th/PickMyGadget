"use client";

import Link from "next/link";
import { useKeywordCounts } from "@/hooks/useKeywordCounts";

type Props = {
  limit?: number;
};

export const FeatureKeywordList = ({ limit = 20 }: Props) => {
  const keywordCounts = useKeywordCounts(); // ✅ 配列として直接返る

  const sorted = keywordCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {sorted.map(({ keyword, count }) => (
          <Link
            key={keyword}
            href={`/features/${encodeURIComponent(keyword)}`}
            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
          >
            {keyword}（{count}）
          </Link>
        ))}
      </div>
      <Link
        href="/features"
        className="block mt-2 text-sm text-blue-600 hover:underline"
      >
        → すべての特徴キーワードを見る
      </Link>
    </div>
  );
};
