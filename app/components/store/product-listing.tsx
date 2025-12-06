"use client";

import { useCallback, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import ProductCard from "@/app/components/product-card";
import Filters from "./filters";
import SortSelect from "./sort-select";
import SearchBar from "./search-bar";
import EmptyState from "@/app/components/empty-state";
import { Switch, Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useFormat } from "@/app/hooks/use-format";
import StorePagination from "./store-pagination";

export default function ProductListing({
  products,
  categories,
  metadata,
  savedItemIds = [],
}: {
  products: any[];
  categories: any[];
  metadata: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  savedItemIds?: string[];
}) {
  const t = useTranslations("Product");
  const { formatNumber } = useFormat();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get current filters from URL
  const selectedCategories = searchParams.get("category")?.split(",") || [];
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 10000; // Default max if not set
  const hideOutOfStock = searchParams.get("hideOutOfStock") === "true";
  const sortOption = searchParams.get("sort") || "newest";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      // Reset page when filtering
      if (name !== "page") {
        params.set("page", "1");
      }
      return params.toString();
    },
    [searchParams]
  );

  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset page when filtering (unless page is being updated)
    if (!newParams.hasOwnProperty("page")) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleCategoryChange = (categories: string[]) => {
    updateUrl({
      category: categories.length > 0 ? categories.join(",") : null,
    });
  };

  const handlePriceChange = (range: number[]) => {
    // Debouncing could be handled in the Filters component, but for now we update on change
    // Ideally we only update on commit (slider drag end)
    updateUrl({
      minPrice: range[0].toString(),
      maxPrice: range[1].toString(),
    });
  };

  const handleSortChange = (sort: string) => {
    updateUrl({ sort });
  };

  const handleStockChange = (isSelected: boolean) => {
    updateUrl({ hideOutOfStock: isSelected ? "true" : null });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="sticky top-24 flex flex-col gap-6">
          <Filters
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={handleCategoryChange}
            priceRange={[minPrice, maxPrice]}
            setPriceRange={handlePriceChange}
            minPrice={0}
            maxPrice={10000} // This should ideally come from server
          />

          <div className="flex items-center justify-between px-1">
            <span className="text-small text-default-500">
              {t("hideOutOfStock")}
            </span>
            <Switch
              size="sm"
              isSelected={hideOutOfStock}
              onValueChange={handleStockChange}
              aria-label="Hide out of stock items"
            />
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1" id="product-listing">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{t("shopAll")}</h2>
              <span className="text-default-500">
                {formatNumber(metadata.totalCount)} {t("products")}
              </span>
            </div>
            <div className="flex gap-4 items-center w-full sm:w-auto">
              <SearchBar
                initialQuery={searchParams.get("search") || ""}
                onSearch={(q) => updateUrl({ search: q })}
              />
              <SortSelect
                sortOption={sortOption}
                setSortOption={handleSortChange}
              />
            </div>
          </div>

          {isPending ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{ ...product, price: Number(product.price) }}
                    isSaved={savedItemIds.includes(product.id)}
                  />
                ))}
              </div>
              <StorePagination
                totalCount={metadata.totalCount}
                pageSize={metadata.limit}
                currentPage={metadata.currentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
