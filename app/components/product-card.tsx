"use client";

import { Card } from "@heroui/card";
import { Button } from "@heroui/button";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

type Product = {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  price: any;
  stock: number;
  images: string[];
  category: { name: string; nameEn?: string | null } | null;
};

import { useCart } from "@/app/context/cart-context";

import SaveButton from "./store/save-button";

import { useFormat } from "@/app/hooks/use-format";

export default function ProductCard({
  product,
  isSaved = false,
}: {
  product: Product;
  isSaved?: boolean;
}) {
  const { addToCart } = useCart();
  const locale = useLocale();
  const { formatCurrency } = useFormat();
  const isOutOfStock = product.stock <= 0;

  const displayName =
    locale === "en" ? product.nameEn || product.name : product.name;
  const displayCategory =
    locale === "en"
      ? product.category?.nameEn || product.category?.name
      : product.category?.name;

  return (
    <Card
      key={product.id}
      className={`group relative overflow-hidden shadow-sm ${
        isOutOfStock ? "opacity-75" : ""
      }`}
    >
      <div className="overflow-visible p-0">
        <div className="relative aspect-3/4 w-full overflow-hidden">
          <Image
            alt={displayName}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isOutOfStock ? "grayscale" : "group-hover:scale-105"
            }`}
            src={
              product.images[0] || "https://placehold.co/600x800?text=No+Image"
            }
          />
          {/* Link Overlay */}
          <Link
            href={`/products/${product.slug}`}
            className="absolute inset-0 z-10"
          />

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 z-20 bg-default-900/80 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Out of Stock
            </div>
          )}

          {/* Save Button */}
          <div className="absolute top-2 right-2 z-20">
            <SaveButton productId={product.id} isSaved={isSaved} />
          </div>

          {/* Add to Cart Overlay */}
          {!isOutOfStock && (
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-20">
              <Button
                {...({ color: "primary", radius: "full", onPress: () => addToCart(product) } as any)}
                className="w-full font-medium shadow-lg"
              >
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-start gap-1 p-4">
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-1">
            <p className="text-tiny text-default-500 uppercase font-bold">
              {displayCategory}
            </p>
            <h3 className="font-medium text-large text-default-900 line-clamp-1">
              {displayName}
            </h3>
          </div>
          <p className="text-large font-bold text-primary">
            {formatCurrency(Number(product.price))}
          </p>
        </div>
      </div>
    </Card>
  );
}
