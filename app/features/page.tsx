"use client";

import Link from "next/link";
import { useKeywordCounts } from "@/hooks/useKeywordCounts";
import { motion } from "framer-motion";

export default function FeaturesPage() {
  const keywordCounts = useKeywordCounts(); // ✅ 修正ポイント

  const sorted = [...keywordCounts].sort((a, b) => b.count - a.count);

  return (
    <motion.main
      className="p-4 max-w-3xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold">特徴キーワード一覧</h1>
      <p className="text-gray-600">
        スマホ周辺機器の商品に含まれる特徴別に探せます。
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
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
    </motion.main>
  );
}
