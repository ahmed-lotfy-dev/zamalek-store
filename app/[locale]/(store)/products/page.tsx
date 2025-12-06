import { getPaginatedProducts } from "@/app/lib/actions/products";
import { getCategories } from "@/app/lib/actions/categories";
import { getSavedItems } from "@/app/lib/actions/saved-items";
import ProductListing from "@/app/components/store/product-listing";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    sort?: string;
    hideOutOfStock?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const categoryParam = resolvedSearchParams.category;
  const minPrice = resolvedSearchParams.minPrice
    ? Number(resolvedSearchParams.minPrice)
    : undefined;
  const maxPrice = resolvedSearchParams.maxPrice
    ? Number(resolvedSearchParams.maxPrice)
    : undefined;
  const search = resolvedSearchParams.search;
  const sort = resolvedSearchParams.sort;
  const hideOutOfStock = resolvedSearchParams.hideOutOfStock === "true";

  // Fetch categories first to resolve names to IDs
  const categories = await getCategories();

  let categoryIds: string[] | undefined = undefined;
  if (categoryParam) {
    const paramNames = categoryParam
      .split(",")
      .map((n) => n.trim().toLowerCase());
    categoryIds = categories
      .filter(
        (c: any) =>
          paramNames.includes(c.name.toLowerCase()) ||
          (c.nameEn && paramNames.includes(c.nameEn.toLowerCase()))
      )
      .map((c: any) => c.id);
  }

  const [{ products, metadata }, savedItems] = await Promise.all([
    getPaginatedProducts(page, 12, {
      categoryIds,
      minPrice,
      maxPrice,
      search,
      sort,
      hideOutOfStock,
    }),
    getSavedItems(),
  ]);

  const savedItemIds = savedItems.map(
    (item: { productId: string }) => item.productId
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-6 lg:px-8">
        <ProductListing
          products={products.map((p: any) => ({
            ...p,
            price: Number(p.price),
          }))}
          categories={categories}
          metadata={metadata}
          savedItemIds={savedItemIds}
        />
      </main>
    </div>
  );
}
