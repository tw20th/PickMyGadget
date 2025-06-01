"use client";

export const BlogCardSkeleton = () => {
  return (
    <div className="bg-gray-100 animate-pulse rounded-2xl overflow-hidden">
      <div className="h-48 bg-gray-300" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-300 rounded w-1/2" />
        <div className="flex justify-between mt-2">
          <div className="h-3 bg-gray-300 rounded w-1/4" />
          <div className="h-3 bg-gray-300 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};
