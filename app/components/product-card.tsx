"use client";

import { Card, CardBody, CardFooter, Image } from "@heroui/react";

type Product = {
  id: string;
  name: string;
  price: any;
  images: string[];
  category: { name: string } | null;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card
      shadow="sm"
      key={product.id}
      isPressable
      onPress={() => console.log("item pressed")}
    >
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={product.name}
          className="w-full object-cover h-[240px]"
          src={
            product.images[0] || "https://placehold.co/600x400?text=No+Image"
          }
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <div className="flex flex-col items-start">
          <b className="text-default-900">{product.name}</b>
          <p className="text-default-500">{product.category?.name}</p>
        </div>
        <p className="text-default-900 font-semibold">
          ${Number(product.price).toFixed(2)}
        </p>
      </CardFooter>
    </Card>
  );
}
