import { db } from "../src/firebaseAdmin";
import { isItemEligible } from "../src/utils/applyItemFilter";
import { updatePriceHistory } from "../src/utils/updatePriceHistory";
import { extractTagsFromFeatures } from "../src/utils/extractTags";
import { fetchCoverImage } from "../src/utils/fetchImage";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("OpenAI APIキーが設定されていません");

const openai = new OpenAI({ apiKey });

type RakutenItem = {
  id: string;
  itemName: string;
  price: number;
  productKeyword?: string;
  imageUrl?: string;
};

// ✅ カテゴリー推定関数（featureHighlightsから分類）
function inferCategory(featureHighlights: string[]): string {
  const text = featureHighlights.join(" ").toLowerCase();

  if (text.includes("モバイルバッテリー")) return "モバイルバッテリー";
  if (text.includes("ワイヤレス充電器")) return "ワイヤレス充電器";
  if (text.includes("スタンド")) return "スマホスタンド";
  if (text.includes("キーボード")) return "キーボード";
  if (text.includes("マウス")) return "マウス";
  if (text.includes("usb") || text.includes("ハブ")) return "USBハブ";
  if (text.includes("ケーブル")) return "充電ケーブル";
  if (text.includes("イヤホン") || text.includes("ヘッドホン")) return "オーディオ";
  if (text.includes("ケース")) return "スマホケース";

  return "その他";
}

// ✅ 商品名から特徴を抽出する処理
async function extractFeatureHighlightsFromName(name: string): Promise<string[]> {
  const prompt = `
以下の商品名から、ユーザーが注目しそうな特徴を5つ箇条書きで抽出してください。
- 出力形式: ["特徴1", "特徴2", "特徴3", "特徴4", "特徴5"]
- 短く簡潔に
- 抽象的すぎず具体的な特徴を
- 英語ではなく日本語で

商品名: ${name}
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5
  });

  const content = res.choices[0].message.content || "";
  const match = content.match(/\[.*?\]/s);
  if (!match) return [];

  try {
    const list = JSON.parse(match[0]);
    return Array.isArray(list) ? list.map(str => String(str)) : [];
  } catch {
    return [];
  }
}

// ✅ メイン処理
export async function scheduledSelectMonitored() {
  console.log("🟢 selectMonitored 処理開始");

  const snapshot = await db.collection("rakutenItems").get();
  const now = new Date();

  const items: RakutenItem[] = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      itemName: data.itemName,
      price: Number(data.price),
      productKeyword: data.productKeyword,
      imageUrl: data.imageUrl
    };
  });

  console.log(`📦 rakutenItems 取得件数: ${items.length}`);
  const selected = items.filter(isItemEligible);
  console.log(`✅ フィルター通過件数: ${selected.length}`);

  for (const item of selected) {
    try {
      console.log(`📌 処理中: ${item.itemName}`);

      const featureHighlights = await extractFeatureHighlightsFromName(item.itemName);
      const tags = await extractTagsFromFeatures(featureHighlights);
      const imageKeyword = item.productKeyword || "スマホアクセサリー";
      const category = inferCategory(featureHighlights);

      const rakutenDoc = await db.collection("rakutenItems").doc(item.id).get();
      let imageUrl = rakutenDoc.data()?.imageUrl || "";

      if (!imageUrl) {
        console.log("📷 画像なし → Unsplashから取得:", imageKeyword);
        imageUrl = await fetchCoverImage(imageKeyword);
      }

      const monitoredRef = await db.collection("monitoredItems").add({
        productName: item.itemName,
        price: item.price,
        features: "人気のスマホ周辺機器",
        imageKeyword,
        fromRakutenItemId: item.id,
        imageUrl,
        score: 0,
        tag: tags,
        featureHighlights,
        category,
        createdAt: now.toISOString()
      });

      console.log(`✅ 登録成功: ${item.itemName}`);
      await updatePriceHistory(monitoredRef.id, item.price);
    } catch (err) {
      console.error(`❌ エラー: ${item.itemName}`, err);
    }
  }

  console.log(`🏁 完了: ${selected.length} 件を monitoredItems に登録`);
}

// 🔁 単体実行時
if (require.main === module) {
  scheduledSelectMonitored()
    .then(() => {
      console.log("✅ 処理完了");
    })
    .catch(err => {
      console.error("❌ エラー:", err);
    });
}
