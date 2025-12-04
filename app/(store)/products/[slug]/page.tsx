import { getProductBySlug } from "@/app/lib/actions/products";
import { getSavedItems } from "@/app/lib/actions/saved-items";
import ProductDetails from "@/app/components/store/product-details";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const savedItems = await getSavedItems();

  if (!product) {
    notFound();
  }

  const isSaved = savedItems.some((item) => item.productId === product.id);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ProductDetails
          product={{
            ...product,
            price: Number(product.price),
          }}
          isSaved={isSaved}
        />
      </main>
    </div>
  );
}
