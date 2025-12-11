"use client";

import ProductCard from "@/app/components/product-card";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

export default function NewArrivals({
  products,
  savedItemIds = [],
}: {
  products: any[];
  savedItemIds?: string[];
}) {
  const t = useTranslations("HomePage");

  if (products.length === 0) return null;

  return (
    <section className="py-16 border-t border-divider/50">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-3">
            {t("newArrivals")}
          </h2>
          <p className="text-default-500 text-lg">
            {t("newArrivalsDescription")}
          </p>
        </div>
        <Button
          as={Link}
          href="/products?sort=newest"
          variant="light"
          color="primary"
          endContent={<ArrowRight size={20} />}
          className="font-semibold text-lg px-0 hover:bg-transparent hover:text-primary/80 transition-colors"
          disableRipple
        >
          {t("viewAll")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{ ...product, price: Number(product.price) }}
            isSaved={savedItemIds.includes(product.id)}
          />
        ))}
      </div>
    </section>
  );
}
