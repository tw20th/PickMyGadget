"use client";

import { useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

type Props = {
  slug: string;
};

export const UpdateBlogViews = ({ slug }: Props) => {
  useEffect(() => {
    const incrementViews = async () => {
      const q = query(collection(db, "blogs"), where("slug", "==", slug));
      const snapshot = await getDocs(q);
      const docRef = snapshot.docs[0]?.ref;
      if (docRef) {
        try {
          await updateDoc(docRef, {
            views: increment(1),
          });
        } catch (error) {
          console.error("閲覧数の更新に失敗:", error);
        }
      }
    };

    incrementViews();
  }, [slug]);

  return null;
};
