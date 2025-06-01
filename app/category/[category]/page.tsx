"use client";

import { useParams } from "next/navigation";
import { useMonitoredItems } from "@/hooks/useMonitoredItems";
import { usePagination } from "@/hooks/usePagination";
import { useEffect, useMemo, useState } from "react";
import { MonitoredItem } from "@/types/item";
import { SearchInput } from "@/components/common/SearchInput";
import { CategoryFilterBar } from "@/components/category/CategoryFilterBar";
import { ProductList } from "@/components/product/ProductList";

export default function CategoryPage() {
  const { tag } = useParams(); // 実際には /category/[tag] から使う
  const decodedTag = decodeURIComponent(String(tag));
  const { items, loading } = useMonitoredItems();
  const [filtered, setFiltered] = useState<MonitoredItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    if (!loading && decodedTag) {
      const matched = items.filter(
        (item) =>
          (Array.isArray(item.tag) && item.tag.includes(decodedTag)) ||
          item.category === decodedTag
      );
      setFiltered(matched);
    }
  }, [decodedTag, items, loading]);

  const searched = useMemo(() => {
    const lower = keyword.toLowerCase();
    return filtered
      .filter((item) => {
        return (
          item.productName.toLowerCase().includes(lower) ||
          item.featureHighlights?.some((f) =>
            f.toLowerCase().includes(lower)
          ) ||
          item.tag?.some((t) => t.toLowerCase().includes(lower))
        );
      })
      .sort((a, b) =>
        sortOrder === "desc" ? b.score - a.score : a.score - b.score
      );
  }, [filtered, keyword, sortOrder]);

  const tagCounts = items.reduce<Record<string, number>>((acc, item) => {
    if (Array.isArray(item.tag)) {
      item.tag.forEach((t) => {
        acc[t] = (acc[t] || 0) + 1;
      });
    }
    return acc;
  }, {});
  const tagsWithCount = Object.entries(tagCounts).map(([tag, count]) => ({
    tag,
    count,
  }));

  const {
    paginatedItems,
    currentPage,
    totalPages,
    goToNext,
    goToPrev,
    goToPage,
  } = usePagination(searched, 6);

  if (loading) return <div className="p-4">読み込み中...</div>;

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">カテゴリ：{decodedTag}</h1>

      <CategoryFilterBar
        items={tagsWithCount}
        active={decodedTag}
        type="category"
      />

      <SearchInput keyword={keyword} onChange={setKeyword} />

      <div className="flex items-center gap-4 text-sm">
        <span>並び順：</span>
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
          }
          className="px-3 py-1 border rounded-md hover:bg-gray-50"
        >
          スコア {sortOrder === "desc" ? "高い順 ↓" : "低い順 ↑"}
        </button>
      </div>

      {searched.length === 0 ? (
        <div>該当する商品が見つかりませんでした。</div>
      ) : (
        <>
          <ProductList
            products={paginatedItems}
            title={`カテゴリ：${decodedTag}`}
          />
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={goToPrev}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              ← 前へ
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              次へ →
            </button>
          </div>
        </>
      )}
    </main>
  );
}
