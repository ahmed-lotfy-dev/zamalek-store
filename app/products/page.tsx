import { getProducts } from "@/app/lib/actions/products";
import { getCategories } from "@/app/lib/actions/categories";
import StoreNavbar from "@/app/components/store-navbar";
import ProductListing from "@/app/components/store/product-listing";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ProductListing
          products={products.map((p) => ({ ...p, price: Number(p.price) }))}
          categories={categories}
        />
      </main>
    </div>
  );
}
