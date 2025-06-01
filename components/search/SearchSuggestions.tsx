"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "searchHistory";

export const SearchSuggestions = () => {
  const router = useRouter();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const handleClick = (word: string) => {
    router.push(`/search?q=${encodeURIComponent(word)}`);
  };

  const popular = ["ワイヤレスイヤホン", "充電器", "スマホスタンド"];

  return (
    <div className="space-y-4">
      {/* 🔁 最近の検索 */}
      {history.length > 0 && (
        <div>
          <div className="font-bold mb-1">最近の検索</div>
          <div className="flex flex-wrap gap-2">
            {history.slice(0, 5).map((w) => (
              <button
                key={w}
                onClick={() => handleClick(w)}
                className="bg-blue-100 hover:bg-blue-200 text-sm px-3 py-1 rounded-full"
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ⭐ 人気キーワード */}
      <div>
        <div className="font-bold mb-1">人気キーワード</div>
        <div className="flex flex-wrap gap-2">
          {popular.map((w) => (
            <button
              key={w}
              onClick={() => handleClick(w)}
              className="bg-yellow-100 hover:bg-yellow-200 text-sm px-3 py-1 rounded-full"
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
