// hooks/useKeywordCounts.ts
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export const useKeywordCounts = () => {
  const [keywords, setKeywords] = useState<
    { keyword: string; count: number }[]
  >([]);

  useEffect(() => {
    const fetchKeywords = async () => {
      const snap = await getDocs(collection(db, "monitoredItems"));
      const counts: Record<string, number> = {};

      snap.docs.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data.featureHighlights)) {
          data.featureHighlights.forEach((kw: string) => {
            counts[kw] = (counts[kw] || 0) + 1;
          });
        }
      });

      const list = Object.entries(counts).map(([keyword, count]) => ({
        keyword,
        count,
      }));
      setKeywords(list);
    };

    fetchKeywords();
  }, []);

  return keywords;
};
