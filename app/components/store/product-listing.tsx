"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/app/components/product-card";
import Filters from "./filters";
import SortSelect from "./sort-select";
import SearchBar from "./search-bar";
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
  const [sortOption, setSortOption] = useState("newest");

  // Calculate min and max price from all products
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 100 };
    const prices = products.map((p) => Number(p.price));
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const [priceRange, setPriceRange] = useState<number[]>([minPrice, maxPrice]);

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

    // Filter by Price
    result = result.filter((product) => {
      const price = Number(product.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "price_asc":
          return Number(a.price) - Number(b.price);
        case "price_desc":
          return Number(b.price) - Number(a.price);
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return result;
  }, [products, selectedCategories, hideOutOfStock, priceRange, sortOption]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="sticky top-24 flex flex-col gap-6">
          <Filters
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Shop All</h2>
              <span className="text-default-500">
                {filteredProducts.length} Products
              </span>
            </div>
            <div className="flex gap-4 items-center w-full sm:w-auto">
              <SearchBar />
              <SortSelect
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            </div>
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
