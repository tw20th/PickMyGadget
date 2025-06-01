export type MonitoredItem = {
  id?: string;
  productName: string;
  price: string;
  score: number;
  featureHighlights?: string[];
  tag?: string[];
  fromRakutenItemId?: string;
  priceHistory?: { date: string; price: number }[];
  imageKeyword?: string;
  imageUrl?: string;
  itemUrl?: string;

  // ✅ 追加
  category?: string;
};
