import { fetchRakutenItems } from "../utils/fetchRakutenItems";
import * as dotenv from "dotenv";
dotenv.config();

// 🔍 任意の検索キーワードをここで指定
const keyword = "スマホスタンド"; // ← ここを変更すれば自由にカテゴリ取得

async function main() {
  try {
    console.log(`🚀 楽天APIから「${keyword}」で商品を取得中...`);
    await fetchRakutenItems(keyword);
    console.log("✅ 取得完了");
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
