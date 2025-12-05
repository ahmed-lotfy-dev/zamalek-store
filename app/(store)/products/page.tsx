import { getProducts } from "@/app/lib/actions/products";
import { getCategories } from "@/app/lib/actions/categories";
import { getSavedItems } from "@/app/lib/actions/saved-items";
import ProductListing from "@/app/components/store/product-listing";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [products, categories, savedItems, resolvedSearchParams] =
    await Promise.all([
      getProducts(),
      getCategories(),
      getSavedItems(),
      searchParams,
    ]);

  const savedItemIds = savedItems.map(
    (item: { productId: string }) => item.productId
  );

  const categoryParam = resolvedSearchParams.category;
  const initialCategoryIds = categoryParam
    ? categories
        .filter(
          (c: any) => c.name.toLowerCase() === categoryParam.toLowerCase()
        )
        .map((c: any) => c.id)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-6 lg:px-8">
        <ProductListing
          key={initialCategoryIds.join("-")}
          products={products.map((p: any) => ({
            ...p,
            price: Number(p.price),
          }))}
          categories={categories}
          initialCategoryIds={initialCategoryIds}
          savedItemIds={savedItemIds}
        />
      </main>
    </div>
  );
}
