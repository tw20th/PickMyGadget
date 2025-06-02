import * as dotenv from "dotenv";
dotenv.config(); // ローカル環境用

import { config as functionsConfig } from "firebase-functions";
import { OpenAI } from "openai";

// ✅ ローカル優先 → Firebase config の順に取得
const apiKey = process.env.OPENAI_API_KEY || functionsConfig().openai?.api_key;

if (!apiKey || typeof apiKey !== "string") {
  console.error("❌ OpenAI APIキーが見つかりません。");
  throw new Error("OpenAI APIキーが未設定です");
}

const openai = new OpenAI({ apiKey });

export default openai;
