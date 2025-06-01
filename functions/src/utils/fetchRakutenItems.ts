// functions/src/utils/fetchRakutenItems.ts
import fetch from "node-fetch";
import { db } from "../firebaseAdmin";
import { config } from "firebase-functions";
import * as dotenv from "dotenv";
dotenv.config();

const applicationId = config().rakuten?.app_id ?? process.env.RAKUTEN_APP_ID;
const affiliateId = config().rakuten?.affiliate_id ?? process.env.RAKUTEN_AFFILIATE_ID;

if (!applicationId) throw new Error("Rakuten Application ID が未設定です");
if (!affiliateId) throw new Error("Rakuten Affiliate ID が未設定です");

type RakutenResponse = {
  Items: {
    Item: {
      itemCode: string;
      itemName: string;
      itemPrice: number;
      itemUrl: string;
      affiliateUrl?: string;
      mediumImageUrls: { imageUrl: string }[];
    };
  }[];
};

export async function fetchRakutenItems(keyword: string): Promise<void> {
  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&keyword=${encodeURIComponent(
    keyword
  )}&applicationId=${applicationId}&affiliateId=${affiliateId}&hits=30&sort=-updateTimestamp`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Rakuten API fetch failed: ${res.status}`);

  const data = (await res.json()) as RakutenResponse;

  const now = new Date();

  for (const wrapper of data.Items) {
    const item = wrapper.Item;

    await db.collection("rakutenItems").add({
      itemCode: item.itemCode,
      itemName: item.itemName,
      price: item.itemPrice,
      imageUrl: item.mediumImageUrls?.[0]?.imageUrl ?? "",
      itemUrl: item.itemUrl,
      affiliateUrl: item.affiliateUrl ?? "",
      createdAt: now.toISOString()
    });

    console.log(`✅ 取得: ${item.itemName}`);
  }

  console.log("🏁 全件保存完了");
}
