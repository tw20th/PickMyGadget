// functions/src/utils/openaiClient.ts

import * as dotenv from "dotenv";
dotenv.config(); // ← ローカル環境用

import { config } from "firebase-functions";
import { OpenAI } from "openai";

// ✅ ローカル優先 → Firebase の順で参照
const apiKey = process.env.OPENAI_API_KEY || config()?.openai?.key;

if (!apiKey) {
  throw new Error("OpenAI APIキーが未設定です");
}

const openai = new OpenAI({ apiKey });
export default openai;
