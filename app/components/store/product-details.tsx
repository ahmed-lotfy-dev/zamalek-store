"use client";

import { useState } from "react";
import { Image, Button, Chip, Input } from "@heroui/react";
import { useCart } from "@/app/context/cart-context";
import SaveButton from "./save-button";
import { ShoppingCart, Minus, Plus } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: any;
  stock: number;
  images: string[];
  category: { name: string } | null;
};

export default function ProductDetails({
  product,
  isSaved = false,
}: {
  product: Product;
  isSaved?: boolean;
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
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
      {/* Image Section */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-content2">
        <Image
          shadow="none"
          radius="none"
          width="100%"
          alt={product.name}
          className={`w-full h-full object-cover ${
            isOutOfStock ? "grayscale opacity-75" : ""
          }`}
          src={
            product.images[0] || "https://placehold.co/600x800?text=No+Image"
          }
        />
        {isOutOfStock && (
          <div className="absolute top-4 left-4 z-20 bg-default-900/80 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            Out of Stock
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <p className="text-small text-primary uppercase font-bold tracking-wider">
                {product.category?.name}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            </div>
            <SaveButton productId={product.id} isSaved={isSaved} />
          </div>
          <p className="text-2xl font-bold mt-4">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-default-500">
          <p>{product.description}</p>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          {!isOutOfStock && (
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
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
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={incrementQuantity}
                  isDisabled={quantity >= product.stock}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <span className="text-small text-default-400">
                {product.stock} available
              </span>
            </div>
          )}

          <Button
            size="lg"
            color="primary"
            className="w-full font-semibold"
            startContent={<ShoppingCart size={20} />}
            onPress={handleAddToCart}
            isDisabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
