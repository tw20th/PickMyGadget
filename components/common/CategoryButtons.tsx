// components/common/CategoryButtons.tsx
"use client";

import { useRouter } from "next/navigation";
import { useCategoryCounts } from "@/hooks/useCategoryCounts";

export const CategoryButtons = () => {
  const router = useRouter();
  const categories = useCategoryCounts();

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(({ category, count }) => (
        <button
          key={category}
          onClick={() =>
            router.push(`/category/${encodeURIComponent(category)}`)
          }
          className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
        >
          #{category}（{count}）
        </button>
      ))}
    </div>
  );
};
