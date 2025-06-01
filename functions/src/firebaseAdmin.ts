import * as dotenv from "dotenv";
dotenv.config(); // ← 必ず一番上で呼び出す！

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// デバッグ用ログ（firebaseApp初期化前なのでnullの可能性あり）
console.log("✅ 接続中のFirebaseプロジェクト（初期化前）:", getApps()[0]?.options.projectId);

const projectId = process.env.FB_PROJECT_ID;
const clientEmail = process.env.FB_CLIENT_EMAIL;
const privateKeyBase64 = process.env.FB_PRIVATE_KEY_BASE64;

if (!projectId || !clientEmail || !privateKeyBase64) {
  throw new Error("Missing Firebase environment variables.");
}

// Base64 → 秘密鍵文字列へデコード
const privateKey = Buffer.from(privateKeyBase64, "base64").toString("utf-8");

const firebaseApp = initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey
  })
});

console.log("✅ Firebase 初期化完了:", firebaseApp.name);

export const db = getFirestore(firebaseApp);
