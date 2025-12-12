"use client";

import ProductCard from "@/app/components/product-card";
import { Button } from "@/components/ui/button";

import { Link } from "@/i18n/routing";
import { Heart } from "lucide-react";

interface SavedItemsListProps {
  savedItems: any[];
}

export default function SavedItemsList({ savedItems }: SavedItemsListProps) {
  if (savedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Heart className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No saved items yet</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start saving your favorite items by clicking the heart icon on any
          product.
        </p>
        <Link href="/products">
          <Button
            size="lg"
          >
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {savedItems.map((item) => (
        <ProductCard
          key={item.id}
          product={{
            ...item.product,
            price: Number(item.product.price),
          }}
          isSaved={true}
        />
      ))}
    </div>
  );
}
