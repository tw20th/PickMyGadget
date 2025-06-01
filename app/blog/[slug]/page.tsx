import { notFound } from "next/navigation";
import { Blog } from "@/types/blog";
import { db } from "@/lib/firebaseClient";
import { getDocs, collection, query, where } from "firebase/firestore";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { BlogMarkdownRenderer } from "@/components/blog/BlogMarkdownRenderer";
import { UpdateBlogViews } from "@/components/blog/UpdateBlogViews";
import { RelatedBlogs } from "@/components/blog/RelatedBlogs";
import { SnsShareButtons } from "@/components/blog/SnsShareButtons";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

export default async function BlogDetailPage({ params }: Props) {
  const q = query(collection(db, "blogs"), where("slug", "==", params.slug));
  const snapshot = await getDocs(q);
  const data = snapshot.docs[0]?.data() as Blog;

  if (!data) return notFound();

  const relatedQuery = query(
    collection(db, "blogs"),
    where("tags", "array-contains-any", data.tags.slice(0, 5))
  );
  const relatedSnapshot = await getDocs(relatedQuery);
  const relatedBlogs = relatedSnapshot.docs.map((doc) => doc.data() as Blog);

  return (
    <main className="p-4 max-w-3xl mx-auto space-y-6">
      {/* 🔙 戻るリンク */}
      <div>
        <Link
          href="/blog"
          className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
        >
          ← ブログ一覧に戻る
        </Link>
      </div>

      <UpdateBlogViews slug={params.slug} />

      {data.imageUrl && (
        <div className="relative w-full h-60">
          <Image
            src={data.imageUrl}
            alt={data.title}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold">{data.title}</h1>

      <div className="text-sm text-gray-500 flex gap-4">
        <span>
          📅{" "}
          {new Date(data.createdAt).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <span>👁 {data.views} views</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.isArray(data.tags) &&
          data.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="text-xs bg-blue-50 px-2 py-1 rounded-full text-blue-700 hover:bg-blue-100 transition"
            >
              #{tag}
            </Link>
          ))}
      </div>

      <TableOfContents content={data.content} />
      <BlogMarkdownRenderer content={data.content} />

      <SnsShareButtons />
      <RelatedBlogs relatedBlogs={relatedBlogs} currentSlug={params.slug} />
    </main>
  );
}
