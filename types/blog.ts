export type Blog = {
  id?: string;
  slug: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  category: string;
  productId: string;
  createdAt: string;
  views: number;
  excerpt?: string; // ✅ 追加（省略可能として定義）
};
