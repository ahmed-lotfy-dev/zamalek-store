import { getProducts } from "@/app/lib/actions/products";
import { getCategories } from "@/app/lib/actions/categories";
import ProductListing from "@/app/components/store/product-listing";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [products, categories, resolvedSearchParams] = await Promise.all([
    getProducts(),
    getCategories(),
    searchParams,
  ]);

  const categoryParam = resolvedSearchParams.category;
  const initialCategoryIds = categoryParam
    ? categories
        .filter((c) => c.name.toLowerCase() === categoryParam.toLowerCase())
        .map((c) => c.id)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ProductListing
          key={initialCategoryIds.join("-")}
          products={products.map((p) => ({ ...p, price: Number(p.price) }))}
          categories={categories}
          initialCategoryIds={initialCategoryIds}
        />
      </main>
    </div>
  );
}
