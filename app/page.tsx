import { getProducts } from "@/app/lib/actions/products";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 z-10 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Zamalek Store
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/admin/products"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Admin Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">New Arrivals</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Check out our latest collection of products.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50">
              <p className="text-zinc-500 dark:text-zinc-400">
                No products found.
              </p>
              <Link
                href="/admin/products/new"
                className="mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        <a href="#">
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.name}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {product.category?.name}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
