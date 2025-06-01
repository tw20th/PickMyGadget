// app/features/[keyword]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import { ProductList } from "@/components/product/ProductList";
import { motion } from "framer-motion";
import type { MonitoredItem } from "@/types/item";

export default function FeatureKeywordPage() {
  const { keyword } = useParams();
  const decodedKeyword = decodeURIComponent(keyword as string);

  const [products, setProducts] = useState<MonitoredItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "monitoredItems"));
      const filtered = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as MonitoredItem))
        .filter((item) =>
          Array.isArray(item.featureHighlights)
            ? item.featureHighlights.includes(decodedKeyword)
            : false
        );

      setProducts(filtered);
      setLoading(false);
    };

    fetch();
  }, [decodedKeyword]);

  return (
    <motion.main
      className="p-4 max-w-5xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold">特徴「{decodedKeyword}」のある商品</h1>

      {loading ? (
        <div>読み込み中...</div>
      ) : products.length === 0 ? (
        <p>該当する商品が見つかりませんでした。</p>
      ) : (
        <ProductList products={products} title="" />
      )}
    </motion.main>
  );
}
