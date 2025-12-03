"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/app/components/product-card";
import Filters from "./filters";
import EmptyState from "@/app/components/empty-state";

export default function ProductListing({
  products,
  categories,
  initialCategoryIds = [],
}: {
  products: any[];
  categories: any[];
  initialCategoryIds?: string[];
}) {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategoryIds);

  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products;
    return products.filter((product) =>
      selectedCategories.includes(product.categoryId)
    );
  }, [products, selectedCategories]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="sticky top-24">
          <Filters
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Shop All</h2>
            <span className="text-default-500">
              {filteredProducts.length} Products
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, price: Number(product.price) }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
