// components/section/FeaturedProducts.tsx
"use client";

import { useMonitoredItems } from "@/hooks/useMonitoredItems";
import { ProductList } from "@/components/product/ProductList";
import { motion } from "framer-motion";

export const FeaturedProducts = () => {
  const { items, loading } = useMonitoredItems();

  const topItems = [...items].sort((a, b) => b.score - a.score).slice(0, 6);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-4">注目のスマホ周辺機器</h2>
      {loading ? <div>読み込み中...</div> : <ProductList products={topItems} />}
    </motion.section>
  );
};
