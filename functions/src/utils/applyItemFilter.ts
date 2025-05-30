import fs from "fs";
import path from "path";

const rulePath = path.resolve(__dirname, "../../filters/itemFilterRules.json");
const rules = JSON.parse(fs.readFileSync(rulePath, "utf-8"));

export function isItemEligible(item: { itemName: string; price: number }): boolean {
  const name = item.itemName || "";
  const price = Number(item.price);

  if (isNaN(price)) return false;

  // 除外ワードを含んでいないか
  if (rules.excludeKeywords.some((kw: string) => name.includes(kw))) {
    return false;
  }

  // ブランド名が1つでも含まれているか
  if (!rules.preferredBrands.some((brand: string) => name.includes(brand))) {
    return false;
  }

  // 価格帯チェック
  if (price < rules.minPrice || price > rules.maxPrice) {
    return false;
  }

  return true;
}
