"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type BlogCardProps = {
  slug: string;
  title: string;
  imageUrl?: string;
  tags?: string[];
  views?: number;
  createdAt?: string;
  excerpt?: string;
  isNew?: boolean; // 🆕 NEWバッジ
};

export const BlogCard = ({
  slug,
  title,
  imageUrl,
  tags = [],
  views = 0,
  createdAt,
  excerpt,
  isNew,
}: BlogCardProps) => {
  const formattedDate =
    createdAt &&
    new Date(createdAt).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Link href={`/blog/${slug}`}>
      <motion.div
        className="bg-white shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {imageUrl && (
          <div className="relative w-full h-48">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover rounded-t-2xl"
            />
          </div>
        )}

        {/* 🆕 NEWバッジ */}
        {isNew && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
            NEW
          </span>
        )}

        <div className="p-4 space-y-2">
          <h2 className="text-lg font-semibold line-clamp-2">{title}</h2>

          {excerpt && (
            <p className="text-sm text-gray-600 line-clamp-3">{excerpt}</p>
          )}

          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="text-xs text-gray-500 flex justify-between mt-2">
            <span>👁 {views > 0 ? views : "－"}</span>
            {formattedDate && <span>{formattedDate}</span>}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
