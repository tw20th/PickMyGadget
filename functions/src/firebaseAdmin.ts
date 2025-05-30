import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config();

const projectId = process.env.FB_PROJECT_ID;
const clientEmail = process.env.FB_CLIENT_EMAIL;
const privateKeyBase64 = process.env.FB_PRIVATE_KEY_BASE64;

if (!projectId || !clientEmail || !privateKeyBase64) {
  throw new Error("Missing Firebase environment variables.");
}

// Base64 → 文字列復号
const privateKey = Buffer.from(privateKeyBase64, "base64").toString("utf-8");

const firebaseApp = initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey
  })
});

export const db = getFirestore(firebaseApp);
