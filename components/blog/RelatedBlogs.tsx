import Link from "next/link";
import { Blog } from "@/types/blog";

type Props = {
  relatedBlogs: Blog[];
  currentSlug: string;
};

export const RelatedBlogs = ({ relatedBlogs, currentSlug }: Props) => {
  const filtered = relatedBlogs
    .filter((b) => b.slug !== currentSlug)
    .slice(0, 4);

  if (filtered.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">🔗 関連記事</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((blog) => (
          <Link
            key={blog.slug}
            href={`/blog/${blog.slug}`}
            className="block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <p className="text-sm text-gray-500 mb-1">
              {new Date(blog.createdAt).toLocaleDateString("ja-JP")}
            </p>
            <p className="font-medium">{blog.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
