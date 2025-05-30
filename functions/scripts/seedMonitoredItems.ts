import { db } from "../src/firebaseAdmin";
import { isItemEligible } from "../src/utils/applyItemFilter";

type RakutenItem = {
  id: string;
  itemName: string;
  price: number;
  imageUrl?: string;
  itemUrl?: string;
  productKeyword?: string;
};

export async function selectAndSaveMonitoredItems() {
  console.log("🚀 monitoredItems への変換を開始");

  const snapshot = await db.collection("rakutenItems").get();
  const now = new Date();

  const items: RakutenItem[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<RakutenItem, "id">)
  }));

  const selected = items.filter(item => {
    const eligible = isItemEligible(item);
    if (!eligible) {
      console.log(`❌ 除外: ${item.itemName}（価格: ${item.price}）`);
    }
    return eligible;
  });

  let successCount = 0;

  for (const item of selected) {
    await db.collection("monitoredItems").add({
      productName: item.itemName,
      price: item.price,
      imageUrl: item.imageUrl || "",
      itemUrl: item.itemUrl || "",
      features: `${item.itemName} は、コストパフォーマンスに優れたおすすめ商品です。`, // 仮説明
      imageKeyword: item.productKeyword || item.itemName, // 検索キーワードにも使える
      fromRakutenItemId: item.id,
      score: 0,
      tag: [],
      featureHighlights: [],
      createdAt: now.toISOString()
    });

    console.log(`✅ 登録: ${item.itemName}`);
    successCount++;
  }

  console.log(`🏁 完了: ${successCount} 件を monitoredItems に登録しました`);
}

// 実行
selectAndSaveMonitoredItems();
