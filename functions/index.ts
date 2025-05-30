// functions/index.ts

import * as functions from "firebase-functions/v1";
import { scheduledBlog } from "./src/scheduledBlog";
import { scheduledRakuten } from "./src/scheduledRakuten";
import { scheduledSelectMonitored } from "./src/scheduledSelectMonitored";

export const fetchRakutenDaily = functions.pubsub
  .schedule("0 5 * * *") // JSTで毎日朝5時
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    console.log("🕔 [Cron] Fetching Rakuten items...");
    await scheduledRakuten();
  });

export const selectMonitoredDaily = functions.pubsub
  .schedule("30 5 * * *") // 毎朝5:30（楽天取得後）
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    console.log("🕔 [Cron] Selecting monitored items...");
    await scheduledSelectMonitored();
  });

export const generateBlogDailyV1 = functions.pubsub
  .schedule("0 6 * * *") // JST 毎日朝6時
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    console.log("🕒 [Cron] Generating blog (v1)...");
    try {
      await scheduledBlog();
      console.log("✅ Blog generation complete.");
    } catch (error) {
      console.error("❌ Blog generation failed:", error);
    }
  });
