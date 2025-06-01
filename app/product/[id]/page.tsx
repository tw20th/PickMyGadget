"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PriceChart } from "@/components/product/PriceChart";
import { ProductCard } from "@/components/product/ProductCard";
import { TwitterShareButton } from "@/components/common/SnsShare";
import { MonitoredItem } from "@/types/item";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [monitored, setMonitored] = useState<MonitoredItem | null>(null);
  const [itemUrl, setItemUrl] = useState<string | null>(null);
  const [relatedItems, setRelatedItems] = useState<MonitoredItem[]>([]);

  useEffect(() => {
    if (typeof id !== "string") return;

    const fetchData = async () => {
      const ref = doc(db, "monitoredItems", id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const data = snap.data() as MonitoredItem;
      setMonitored(data);

      // 楽天リンク
      if (data.fromRakutenItemId) {
        const rakutenRef = doc(db, "rakutenItems", data.fromRakutenItemId);
        const rakutenSnap = await getDoc(rakutenRef);
        if (rakutenSnap.exists()) {
          setItemUrl(rakutenSnap.data().itemUrl);
        }
      }

      // 関連商品
      const allSnap = await getDocs(collection(db, "monitoredItems"));
      const related = allSnap.docs
        .map((d) => ({ id: d.id, ...(d.data() as MonitoredItem) }))
        .filter(
          (item) =>
            item.id !== id &&
            Array.isArray(item.tag) &&
            item.tag.some((t) => data.tag?.includes(t))
        )
        .slice(0, 6);

      setRelatedItems(related);
    };

    fetchData();
  }, [id]);

  if (!monitored) return <div className="p-4">読み込み中...</div>;

  return (
    <main className="p-4 max-w-2xl mx-auto space-y-6">
      {/* ← 戻るリンク */}
      <Link
        href="/"
        className="inline-block text-blue-600 text-sm hover:underline mb-2"
      >
        ← 一覧に戻る
      </Link>

      <h1 className="text-2xl font-bold">{monitored.productName}</h1>

      <div className="relative w-full h-64 rounded-xl overflow-hidden">
        <Image
          src={
            monitored.imageUrl ??
            `/images/${monitored.imageKeyword ?? "no-image"}.jpg`
          }
          alt={monitored.productName}
          fill
          className="object-cover"
        />
      </div>

      <div className="text-gray-600 text-sm">
        現在価格：{monitored.price} 円
      </div>
      <div className="text-sm text-gray-500">スコア：{monitored.score}</div>

      <div className="space-y-1">
        <h2 className="font-semibold text-sm">特徴</h2>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {monitored.featureHighlights?.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {monitored.tag?.map((t) => (
          <span
            key={t}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* 楽天リンク */}
      {itemUrl && (
        <a
          href={itemUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 w-full text-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
        >
          楽天で商品を見る →
        </a>
      )}

      {/* SNSシェアボタン */}
      {itemUrl && (
        <TwitterShareButton
          url={itemUrl}
          title={`${monitored.productName} をチェック！`}
        />
      )}

      {/* 価格履歴 + グラフ */}
      {Array.isArray(monitored.priceHistory) && (
        <div className="mt-6">
          <h2 className="font-bold text-sm mb-2">価格履歴</h2>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            {monitored.priceHistory.map((entry, i) => (
              <li key={i}>
                {entry.date}：{entry.price} 円
              </li>
            ))}
          </ul>
          <PriceChart history={monitored.priceHistory} />
        </div>
      )}

      {/* 🧩 関連商品 */}
      {relatedItems.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">関連商品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
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
    </main>
  );
}
