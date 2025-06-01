"use client";

import { useBlogs } from "@/hooks/useBlogs";
import { BlogCard } from "@/components/blog/BlogCard";
import { TagList } from "@/components/blog/TagList";
import { useSortedBlogs, BlogSortOption } from "@/hooks/useSortedBlogs";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";
import { SearchInput } from "@/components/common/SearchInput";
import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";
import { motion } from "framer-motion";

export default function BlogPage() {
  const { blogs, loading } = useBlogs();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [sortOption, setSortOption] = useState<BlogSortOption>("latest");

  const sorted = useSortedBlogs(blogs, sortOption);

  const filtered = sorted.filter((b) => {
    const matchesTag = selectedTag
      ? (b.tags ?? []).includes(selectedTag)
      : true;
    const matchesKeyword =
      keyword === "" ||
      b.title.toLowerCase().includes(keyword.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(keyword.toLowerCase()));
    return matchesTag && matchesKeyword;
  });

  const {
    paginatedItems,
    currentPage,
    totalPages,
    goToNext,
    goToPrev,
    goToPage,
  } = usePagination(filtered, 6);

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">ブログ一覧</h1>

      <SearchInput keyword={keyword} onChange={setKeyword} />

      <div className="flex justify-end mb-2">
        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value as BlogSortOption);
            goToPage(1);
          }}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="latest">🆕 新着順</option>
          <option value="viewsDesc">🔥 人気順</option>
        </select>
      </div>

      <TagList
        tags={blogs.flatMap((b) => b.tags)}
        selected={selectedTag}
        onSelect={(tag) => {
          setSelectedTag(tag);
          goToPage(1);
        }}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div>該当する記事がありません</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedItems.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
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

          {/* 🔁 ページネーションUI */}
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
