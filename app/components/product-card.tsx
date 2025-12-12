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
      className={`group relative overflow-hidden border-none shadow-sm ${isOutOfStock ? "opacity-75" : ""
        }`}
    >
      <div className="overflow-visible p-0">
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-t-lg">
          <Image
            alt={displayName}
            fill
            className={`w-full h-full object-cover transition-transform duration-300 ${isOutOfStock ? "grayscale" : "group-hover:scale-105"
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
            <Badge variant="destructive" className="absolute top-2 left-2 z-20">
              Out of Stock
            </Badge>
          )}

          {/* Save Button */}
          <div className="absolute top-2 right-2 z-20">
            <SaveButton productId={product.id} isSaved={isSaved} />
          </div>

          {/* Add to Cart Overlay */}
          {!isOutOfStock && (
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-20 pointer-events-none">
              <Button
                variant="default"
                className="w-full font-medium shadow-lg pointer-events-auto rounded-full"
                onClick={() => addToCart(product)}
              >
                Add to Cart
                <ShoppingCart className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <CardContent className="flex flex-col items-start gap-1 p-4">
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              {displayCategory}
            </p>
            <h3 className="font-medium text-lg leading-tight line-clamp-1 group-hover:underline decoration-primary underline-offset-4">
              {displayName}
            </h3>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-lg font-bold text-primary">
          {formatCurrency(Number(product.price))}
        </p>
      </CardFooter>
    </Card>
  );
}
