"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export const SearchBar = ({ initialValue = "" }: { initialValue?: string }) => {
  const [input, setInput] = useState(initialValue);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        placeholder="商品名や特徴で検索"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
      >
        検索
      </button>
    </form>
  );
};
