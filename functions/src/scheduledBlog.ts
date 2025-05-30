import { generateBlogContent } from "./prompts/blogPrompt";
import { fetchCoverImage } from "./utils/fetchImage";
import { postBlog } from "./utils/postBlog";
import { getMonitoredItemRandom } from "./utils/getMonitoredItem";
import { extractTagsFromFeatures } from "./utils/extractTags";
import { db } from "./firebaseAdmin";

export async function scheduledBlog() {
  try {
    console.log("🔁 自動投稿スクリプト開始");

    const item = await getMonitoredItemRandom();
    const {
      productName,
      price,
      features,
      imageKeyword,
      id: productId,
      featureHighlights = []
    } = item;

    // ✅ 重複チェック
    const existingBlogs = await db
      .collection("blogs")
      .where("productId", "==", productId)
      .limit(1)
      .get();

    if (!existingBlogs.empty) {
      console.log(`⚠ ブログはすでに存在します（productId: ${productId}）`);
      return { success: false, reason: "duplicate", productId };
    }

    // ✅ タグ自動生成
    const tags = await extractTagsFromFeatures(featureHighlights);
    console.log("🏷️ 抽出タグ:", tags);

    // ✅ ブログ生成
    const title = `${productName} レビューとおすすめポイント`;
    const slug = `blog-${Date.now()}`;
    const category = "スマホ周辺機器";

    const content = await generateBlogContent({
      productName,
      price,
      features,
      featureHighlights
    });

    const imageUrl = await fetchCoverImage(imageKeyword);

    const result = await postBlog({
      title,
      slug,
      content,
      imageUrl,
      category,
      tags,
      productId
    });

    console.log("✅ 投稿完了:", result.id);
    return result;
  } catch (err) {
    console.error("❌ 自動投稿エラー:", err);
    return { success: false, error: String(err) };
  }
}
if (require.main === module) {
  scheduledBlog()
    .then(() => {
      console.log("✅ scheduledBlog 処理完了");
    })
    .catch(err => {
      console.error("❌ scheduledBlog 実行エラー:", err);
    });
}
