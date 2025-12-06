"use client";

import ProductCard from "@/app/components/product-card";
import { useTranslations } from "next-intl";

interface RelatedProductsProps {
  products: any[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const t = useTranslations("Product");

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">{t("youMayAlsoLike")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
