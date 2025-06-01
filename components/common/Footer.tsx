// components/common/Footer.tsx
import { siteConfig } from "@/lib/config";

export const Footer = () => {
  return (
    <footer className="mt-10 py-6 text-center text-sm text-gray-500 border-t">
      <div className="container mx-auto">
        <p>{siteConfig.copyright}</p>
        <p className="mt-1">{siteConfig.footerNote}</p>
      </div>
    </footer>
  );
};
