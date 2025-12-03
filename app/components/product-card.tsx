"use client";

import { Card, CardBody, CardFooter, Image, Button } from "@heroui/react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: any;
  images: string[];
  category: { name: string } | null;
};

import { useCart } from "@/app/context/cart-context";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Card
      shadow="sm"
      key={product.id}
      className="group relative overflow-hidden"
    >
      <CardBody className="overflow-visible p-0">
        <div className="relative aspect-3/4 w-full overflow-hidden">
          <Image
            shadow="none"
            radius="none"
            width="100%"
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={
              product.images[0] || "https://placehold.co/600x800?text=No+Image"
            }
          />
          {/* Link Overlay */}
          <Link
            href={`/products/${product.id}`}
            className="absolute inset-0 z-10"
          />

          {/* Add to Cart Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-20">
            <Button
              className="w-full font-medium shadow-lg"
              color="primary"
              radius="full"
              onPress={() => addToCart(product)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex flex-col items-start gap-1 p-4">
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-1">
            <p className="text-tiny text-default-500 uppercase font-bold">
              {product.category?.name}
            </p>
            <h3 className="font-medium text-large text-default-900 line-clamp-1">
              {product.name}
            </h3>
          </div>
          <p className="text-large font-bold text-primary">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
