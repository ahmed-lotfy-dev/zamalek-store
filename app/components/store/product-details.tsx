"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useCart } from "@/app/context/cart-context";
import SaveButton from "./save-button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useFormat } from "@/app/hooks/use-format";
import { cn } from "@/app/lib/utils"

type Product = {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  description: string;
  descriptionEn?: string | null;
  price: any;
  stock: number;
  images: string[];
  category: { name: string; nameEn?: string | null } | null;
};

export default function ProductDetails({
  product,
  isSaved = false,
}: {
  product: Product & { variants?: any[] };
  isSaved?: boolean;
}) {
  const { addToCart } = useCart();
  const locale = useLocale();
  const t = useTranslations("Product");
  const { formatCurrency, formatNumber } = useFormat();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const displayName =
    locale === "en" ? product.nameEn || product.name : product.name;
  const displayDescription =
    locale === "en"
      ? product.descriptionEn || product.description
      : product.description;
  const displayCategory =
    locale === "en"
      ? product.category?.nameEn || product.category?.name
      : product.category?.name;

  // Extract unique colors and sizes
  const colors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean))
  );
  const sizes = Array.from(
    new Set(product.variants?.map((v) => v.size).filter(Boolean))
  );

  // Initialize selections if only one option exists
  if (colors.length === 1 && !selectedColor) setSelectedColor(colors[0]);
  if (sizes.length === 1 && !selectedSize) setSelectedSize(sizes[0]);

  const selectedVariant = product.variants?.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const hasVariants = (product.variants?.length || 0) > 0;
  const currentStock = hasVariants
    ? selectedVariant?.stock || 0
    : product.stock;

  const isOutOfStock = currentStock <= 0;
  const isSelectionComplete = hasVariants
    ? selectedColor && selectedSize
    : true;

  const handleAddToCart = () => {
    if (!isSelectionComplete) {
      return;
    }

    const itemToAdd =
      hasVariants && selectedVariant
        ? {
          ...product,
          id: selectedVariant.id,
          name: `${displayName} - ${selectedColor} / ${selectedSize}`,
          stock: selectedVariant.stock,
        }
        : { ...product, name: displayName };

    for (let i = 0; i < quantity; i++) {
      addToCart(itemToAdd);
    }
  };

  const incrementQuantity = () => {
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-secondary lg:max-w-sm">
        <Image
          src={
            product.images[0] || "https://placehold.co/600x600?text=No+Image"
          }
          alt={displayName}
          fill
          className={`object-cover ${isOutOfStock ? "grayscale opacity-75" : ""
            }`}
        />
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-4 left-4 z-20 px-4 py-1 text-sm">
            {t("outOfStock")}
          </Badge>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                {displayCategory}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">{displayName}</h1>
            </div>
            <SaveButton productId={product.id} isSaved={isSaved} />
          </div>
          <p className="text-2xl font-bold mt-4 text-primary">
            {formatCurrency(Number(product.price))}
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
          <p>{displayDescription}</p>
        </div>

        {/* Variants Selection */}
        {hasVariants && (
          <div className="flex flex-col gap-4">
            {colors.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="font-medium">{t("color")}</span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border",
                        selectedColor === color
                          ? "border-primary bg-primary text-primary-foreground shadow hover:bg-primary/90"
                          : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="font-medium">{t("size")}</span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border",
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground shadow hover:bg-primary/90"
                          : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4 mt-auto">
          {!isOutOfStock && isSelectionComplete && (
            <div className="flex items-center gap-4">
              <span className="font-medium">{t("quantity")}</span>
              <div className="flex items-center gap-2 border rounded-lg p-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">
                  {formatNumber(quantity)}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={incrementQuantity}
                  disabled={quantity >= currentStock}
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatNumber(currentStock)} {t("available")}
              </span>
            </div>
          )}

          <Button
            size="lg"
            className="w-full font-semibold gap-2"
            onClick={handleAddToCart}
            disabled={isOutOfStock || !isSelectionComplete}
          >
            <ShoppingCart className="h-5 w-5" />
            {isOutOfStock
              ? t("outOfStock")
              : !isSelectionComplete
                ? t("selectOptions")
                : t("addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
