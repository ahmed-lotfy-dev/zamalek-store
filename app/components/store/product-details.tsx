"use client";

import { useState } from "react";
import { Image, Button, Chip } from "@heroui/react";
import { useCart } from "@/app/context/cart-context";
import SaveButton from "./save-button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useFormat } from "@/app/hooks/use-format";

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
      // Should show error/toast, but for now just return.
      // The button should be disabled anyway.
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
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-default-100 lg:max-w-sm">
        <Image
          src={
            product.images[0] || "https://placehold.co/600x600?text=No+Image"
          }
          width="100%"
          alt={displayName}
          className={`w-full h-full object-cover ${
            isOutOfStock ? "grayscale opacity-75" : ""
          }`}
        />
        {isOutOfStock && (
          <div className="absolute top-4 left-4 z-20 bg-default-900/80 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            {t("outOfStock")}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <p className="text-small text-primary uppercase font-bold tracking-wider">
                {displayCategory}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">{displayName}</h1>
            </div>
            <SaveButton productId={product.id} isSaved={isSaved} />
          </div>
          <p className="text-2xl font-bold mt-4">
            {formatCurrency(Number(product.price))}
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-default-500">
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
                    <Chip
                      key={color}
                      variant={selectedColor === color ? "solid" : "bordered"}
                      color={selectedColor === color ? "primary" : "default"}
                      className="cursor-pointer"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="font-medium">{t("size")}</span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Chip
                      key={size}
                      variant={selectedSize === size ? "solid" : "bordered"}
                      color={selectedSize === size ? "primary" : "default"}
                      className="cursor-pointer"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Chip>
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
              <div className="flex items-center gap-2 border border-divider rounded-lg p-1">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={decrementQuantity}
                  isDisabled={quantity <= 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="w-8 text-center font-medium">
                  {formatNumber(quantity)}
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={incrementQuantity}
                  isDisabled={quantity >= currentStock}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <span className="text-small text-default-400">
                {formatNumber(currentStock)} {t("available")}
              </span>
            </div>
          )}

          <Button
            size="lg"
            color="primary"
            className="w-full font-semibold"
            startContent={<ShoppingCart size={20} />}
            onPress={handleAddToCart}
            isDisabled={isOutOfStock || !isSelectionComplete}
          >
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
