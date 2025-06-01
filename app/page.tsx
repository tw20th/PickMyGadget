"use client";

import { useBlogs } from "@/hooks/useBlogs";
import { useMonitoredItems } from "@/hooks/useMonitoredItems";
import { useSortedBlogs } from "@/hooks/useSortedBlogs";

import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryFilterBar } from "@/components/category/CategoryFilterBar";
import { PopularTags } from "@/components/common/PopularTags";
import { ProductList } from "@/components/product/ProductList";
import { FeatureKeywordList } from "@/components/common/FeatureKeywordList";
import { useTagCounts } from "@/hooks/useTagCounts";

import { motion } from "framer-motion";

export default function HomePage() {
  const { blogs, loading: loadingBlogs } = useBlogs();
  const { items, loading: loadingItems } = useMonitoredItems();
  const tagCounts = useTagCounts(); // タグとカウントを取得

  const topBlogs = useSortedBlogs(blogs, "viewsDesc").slice(0, 3);
  const topItems = [...items].sort((a, b) => b.score - a.score).slice(0, 3);

  const isNew = (dateStr?: string) => {
    if (!dateStr) return false;
    const created = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  };

  return (
    <motion.main
      className="p-4 space-y-10 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ✅ Hero セクション */}
      <motion.section
        className="text-center py-10 bg-gray-100 rounded-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          スマホ周辺機器を徹底比較・レビュー
        </h1>
        <p className="text-gray-600 mb-4">
          価格・特徴・ランキング・ブログで賢く選ぼう。
        </p>

        {/* 🔍 検索バー */}
        <form
          action="/search"
          method="GET"
          className="flex justify-center gap-2 mb-4 flex-wrap"
        >
          <input
            type="text"
            name="q"
            placeholder="検索キーワード"
            className="w-64 px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            検索
          </button>
        </form>

        <a
          href="/ranking"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
        >
          人気ランキングを見る
        </a>
      </motion.section>

      {/* ✅ カテゴリ別 */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <section className="space-y-2">
          <h2 className="text-xl font-bold">人気のタグで探す</h2>
          <CategoryFilterBar items={tagCounts} type="tag" />
        </section>
      </motion.section>

      {/* ✅ 特徴キーワード */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h2 className="text-2xl font-bold mb-4">特徴で絞り込む</h2>
        <FeatureKeywordList />
      </motion.section>

      {/* ✅ 人気タグ */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <PopularTags />
      </motion.section>

      {/* ✅ 人気ブログ */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">人気ブログ記事</h2>
          <a href="/blog" className="text-sm text-blue-600 hover:underline">
            すべての記事を見る →
          </a>
        </div>

        {loadingBlogs ? (
          <div>読み込み中...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                slug={blog.slug}
                title={blog.title}
                imageUrl={blog.imageUrl}
                tags={blog.tags}
                views={blog.views}
                createdAt={blog.createdAt}
                excerpt={blog.excerpt}
                isNew={isNew(blog.createdAt)}
              />
            ))}
          </div>
        )}
      </motion.section>

      {/* ✅ 注目商品 */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4">注目のスマホ周辺機器</h2>
        {loadingItems ? (
          <div>読み込み中...</div>
        ) : (
          <ProductList products={topItems} title="注目の商品" showMedals />
        )}
      </motion.section>
    </motion.main>
  );
}
