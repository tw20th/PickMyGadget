// components/layout/Header.tsx
import Link from "next/link";
import { GlobalSearchBar } from "@/components/common/GlobalSearchBar";
import { siteConfig } from "@/lib/config";

export const Header = () => {
  return (
    <header className="bg-white shadow px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
      <Link href="/" className="text-xl font-bold text-blue-600">
        {siteConfig.siteName}
      </Link>
      <GlobalSearchBar />
    </header>
  );
};
