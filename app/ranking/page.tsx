"use client";

import { useState, useMemo } from "react";
import { useMonitoredItems } from "@/hooks/useMonitoredItems";
import { SortToggle } from "@/components/ranking/SortToggle";
import { RankingFilterBar } from "@/components/ranking/RankingFilterBar";
import { ScoreChart } from "@/components/ranking/ScoreChart";
import { ProductList } from "@/components/product/ProductList";

export default function RankingPage() {
  const { items, loading } = useMonitoredItems();
  const [sortKey, setSortKey] = useState<"score" | "price">("score");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      filterTag ? item.tag?.includes(filterTag) : true
    );
  }, [items, filterTag]);

  const sorted = useMemo(() => {
    return [...filteredItems].sort((a, b) =>
      sortKey === "score"
        ? b.score - a.score
        : parseInt(b.price) - parseInt(a.price)
    );
  }, [filteredItems, sortKey]);

  const allTags = Array.from(new Set(items.flatMap((item) => item.tag ?? [])));

  return (
    <main className="p-4 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        人気ランキング（{sortKey === "score" ? "スコア順" : "価格順"}）
      </h1>

      <SortToggle sortKey={sortKey} onChange={setSortKey} />
      <RankingFilterBar
        tags={allTags}
        selected={filterTag}
        onSelect={setFilterTag}
      />
      <ScoreChart
        scores={sorted.map((item) => ({
          name: item.productName.slice(0, 10),
          score: item.score,
        }))}
      />

      {loading ? (
        <div>読み込み中...</div>
      ) : sorted.length === 0 ? (
        <div>商品データがありません</div>
      ) : (
        <ProductList products={sorted} title="ランキング結果" showMedals />
      )}
    </main>
  );
}
