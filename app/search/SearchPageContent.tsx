"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useBlogs } from "@/hooks/useBlogs";
import { useMonitoredItems } from "@/hooks/useMonitoredItems";
import { BlogCard } from "@/components/blog/BlogCard";
import { ProductCard } from "@/components/product/ProductCard";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/search/SearchBar";
import { SortSelector, SortOption } from "@/components/search/SortSelector";
import { SearchFilters } from "@/components/search/SearchFilters";

export function SearchPageContent() {
  const searchParams = useSearchParams();
  const keyword = (searchParams.get("q") || "").toLowerCase();

  const { blogs } = useBlogs();
  const { items } = useMonitoredItems();

  const [sort, setSort] = useState<SortOption>("score");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // ✅ 一致したブログ記事
  const matchedBlogs = useMemo(() => {
    return blogs.filter(
      (b) =>
        (b.title?.toLowerCase().includes(keyword) ?? false) ||
        (Array.isArray(b.tags) &&
          b.tags.some((t) => t?.toLowerCase().includes(keyword)))
    );
  }, [blogs, keyword]);

  // ✅ 一致した商品
  const matchedItems = useMemo(() => {
    let filtered = items.filter(
      (i) =>
        i.productName?.toLowerCase().includes(keyword) ||
        i.featureHighlights?.some((f) => f?.toLowerCase().includes(keyword)) ||
        i.tag?.some((t) => t?.toLowerCase().includes(keyword))
    );

    if (selectedTag) {
      filtered = filtered.filter((i) => i.tag?.includes(selectedTag));
    }
    if (selectedCategory) {
      filtered = filtered.filter((i) => i.category === selectedCategory);
    }

    if (sort === "score") {
      filtered = filtered.sort((a, b) => b.score - a.score);
    } else if (sort === "price") {
      filtered = filtered.sort((a, b) => Number(a.price) - Number(b.price));
    }

    return filtered;
  }, [items, keyword, sort, selectedTag, selectedCategory]);

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">検索結果：{keyword}</h1>

      <div className="flex flex-col gap-4">
        <SearchBar initialValue={keyword} />
        <SearchFilters
          keyword={keyword}
          items={items}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <SortSelector sort={sort} setSort={setSort} />
      </div>

      {/* 一致した商品 */}
      {matchedItems.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-2">一致した商品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <ProductCard
                  id={item.id}
                  productName={item.productName}
                  price={item.price}
                  imageUrl={
                    item.imageUrl ??
                    `/images/${item.imageKeyword ?? "no-image"}.jpg`
                  }
                  score={item.score}
                  featureHighlights={item.featureHighlights}
                  tag={item.tag}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 一致したブログ記事 */}
      {matchedBlogs.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mt-6 mb-2">一致したブログ記事</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedBlogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <BlogCard
                  slug={blog.slug}
                  title={blog.title}
                  imageUrl={blog.imageUrl}
                  tags={blog.tags}
                  views={blog.views}
                  createdAt={blog.createdAt}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ヒットなし */}
      {matchedItems.length === 0 && matchedBlogs.length === 0 && (
        <div className="text-gray-500 mt-8">
          一致する結果が見つかりませんでした。
        </div>
      )}
    </main>
  );
}
