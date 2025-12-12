"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
import { ShoppingCart } from "lucide-react";

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
      className={`group relative overflow-hidden border-none bg-transparent shadow-none ${isOutOfStock ? "opacity-75" : ""
        }`}
    >
      <div className="overflow-visible p-0">
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-muted/20">
          <Image
            alt={displayName}
            fill
            className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${isOutOfStock ? "grayscale" : "group-hover:scale-105"
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
            <Badge variant="destructive" className="absolute top-3 left-3 z-20 font-bold tracking-wide">
              SOLD OUT
            </Badge>
          )}

          {/* Save Button */}
          <div className="absolute top-3 right-3 z-20">
            <SaveButton productId={product.id} isSaved={isSaved} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-0 mt-4">
        {/* Product Info */}
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
            {displayCategory}
          </p>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-base md:text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {displayName}
            </h3>
            <p className="text-lg font-black tracking-tight whitespace-nowrap">
              {formatCurrency(Number(product.price))}
            </p>
          </div>
        </div>

        {/* Persistent Action Button */}
        {!isOutOfStock && (
          <Button
            size="default"
            className="w-full font-bold shadow-sm rounded-lg gap-2 mt-1 active:scale-95 transition-transform"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            Add to Cart
            <ShoppingCart className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
