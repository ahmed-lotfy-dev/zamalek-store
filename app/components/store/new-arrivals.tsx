"use client";

import ProductCard from "@/app/components/product-card";

export default function NewArrivals({ products }: { products: any[] }) {
  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          New Arrivals
        </h2>
        <p className="text-default-500">
          Check out our latest collection of products.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{ ...product, price: Number(product.price) }}
          />
        ))}
      </div>
    </section>
  );
}
