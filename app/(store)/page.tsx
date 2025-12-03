import { getProducts } from "@/app/lib/actions/products";
import { Button } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";

export default async function StorefrontPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] bg-repeat"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Zamalek Store
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            Premium quality products for your lifestyle. Discover our latest
            collection today.
          </p>
          <Button
            as={Link}
            href="#products"
            size="lg"
            className="bg-black text-white dark:bg-white dark:text-black font-medium"
          >
            Shop Now
          </Button>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-12">Featured Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group block"
            >
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden mb-4 relative">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="font-medium text-lg mb-1">{product.name}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-2 line-clamp-2 text-sm">
                {product.description}
              </p>
              <p className="font-bold">${Number(product.price).toFixed(2)}</p>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            No products available at the moment. Please check back later.
          </div>
        )}
      </section>
    </div>
  );
}
