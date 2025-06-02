import fetch from "node-fetch";
import * as dotenv from "dotenv";
dotenv.config();

import { config } from "firebase-functions";
import { cleanImageKeyword } from "./cleanImageKeyword"; // ✅ 追加

const accessKey = process.env.UNSPLASH_ACCESS_KEY || config().unsplash?.access_key;

if (!accessKey) {
  console.error("❌ Unsplash APIキーが未設定です");
  throw new Error("Unsplash APIキーが未設定です");
}

type UnsplashResponse = {
  results: {
    urls: {
      small: string;
      regular: string;
    };
  }[];
};

export async function fetchCoverImage(rawKeyword: string): Promise<string> {
  const keyword = await cleanImageKeyword(rawKeyword); // ✅ クリーンなキーワードに変換

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    keyword
  )}&client_id=${accessKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Unsplash API request failed: ${res.status}`);

  const data = (await res.json()) as UnsplashResponse;

  if (!data.results || data.results.length === 0) {
    throw new Error("画像が見つかりませんでした");
  }

  return data.results[0].urls.regular;
}
