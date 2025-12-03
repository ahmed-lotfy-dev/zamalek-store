import { getProducts } from "@/app/lib/actions/products";
import StoreNavbar from "@/app/components/store-navbar";
import ProductCard from "@/app/components/product-card";
import EmptyState from "@/app/components/empty-state";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              New Arrivals
            </h1>
            <p className="text-default-500">
              Check out our latest collection of products.
            </p>
          </div>

          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
