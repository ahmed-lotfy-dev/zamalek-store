"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/app/components/product-card";
import Filters from "./filters";
import EmptyState from "@/app/components/empty-state";
import { Switch } from "@heroui/react";

export default function ProductListing({
  products,
  categories,
  initialCategoryIds = [],
  savedItemIds = [],
}: {
  products: any[];
  categories: any[];
  initialCategoryIds?: string[];
  savedItemIds?: string[];
}) {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategoryIds);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.categoryId)
      );
    }

    // Filter by Stock
    if (hideOutOfStock) {
      result = result.filter((product) => product.stock > 0);
    }

    return result;
  }, [products, selectedCategories, hideOutOfStock]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="sticky top-24 flex flex-col gap-6">
          <Filters
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />

          <div className="flex items-center justify-between px-1">
            <span className="text-small text-default-500">
              Hide Out of Stock
            </span>
            <Switch
              size="sm"
              isSelected={hideOutOfStock}
              onValueChange={setHideOutOfStock}
              aria-label="Hide out of stock items"
            />
          </div>
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
                  isSaved={savedItemIds.includes(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
