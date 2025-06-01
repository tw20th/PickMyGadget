"use client";

import { usePathname } from "next/navigation";

export const SnsShareButtons = () => {
  const path = usePathname();
  const url =
    typeof window !== "undefined" ? window.location.origin + path : "";

  return (
    <div className="flex gap-2 mt-6">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
      >
        Xで共有
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-white bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
      >
        Facebook
      </a>
    </div>
  );
};
