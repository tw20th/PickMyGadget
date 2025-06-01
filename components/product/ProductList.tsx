// components/product/ProductList.tsx
"use client";

import { ProductCard } from "./ProductCard";
import { MonitoredItem } from "@/types/item";

type ProductListProps = {
  products: MonitoredItem[];
  title?: string;
  showMedals?: boolean;
};

export const ProductList = ({
  products,
  title,
  showMedals,
}: ProductListProps) => {
  return (
    <section className="space-y-4">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((item, index) => (
          <ProductCard
            key={item.id}
            id={item.id}
            productName={item.productName}
            price={item.price}
            imageUrl={
              item.imageUrl ?? `/images/${item.imageKeyword ?? "no-image"}.jpg`
            }
            score={item.score}
            featureHighlights={item.featureHighlights}
            tag={item.tag}
            rank={showMedals ? index + 1 : undefined}
          />
        ))}
      </div>
    </section>
  );
};
