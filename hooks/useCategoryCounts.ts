// hooks/useCategoryCounts.ts
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export const useCategoryCounts = () => {
  const [categories, setCategories] = useState<
    { category: string; count: number }[]
  >([]);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "monitoredItems"));
      const counts: Record<string, number> = {};

      snap.docs.forEach((doc) => {
        const data = doc.data();
        if (data.category) {
          counts[data.category] = (counts[data.category] || 0) + 1;
        }
      });

      const list = Object.entries(counts).map(([category, count]) => ({
        category,
        count,
      }));
      setCategories(list);
    };

    fetch();
  }, []);

  return categories;
};
