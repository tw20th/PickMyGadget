// hooks/useTagCounts.ts
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export const useTagCounts = (limit = 10) => {
  const [tags, setTags] = useState<{ tag: string; count: number }[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const snap = await getDocs(collection(db, "monitoredItems"));
      const counts: Record<string, number> = {};

      snap.docs.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data.tag)) {
          data.tag.forEach((t: string) => {
            counts[t] = (counts[t] || 0) + 1;
          });
        }
      });

      const sorted = Object.entries(counts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit); // ← 上位 N 件に制限

      setTags(sorted);
    };

    fetchTags();
  }, [limit]);

  return tags;
};
