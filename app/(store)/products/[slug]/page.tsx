import {
  getProductBySlug,
  getRelatedProducts,
} from "@/app/lib/actions/products";
import { getSavedItems } from "@/app/lib/actions/saved-items";
import ProductDetails from "@/app/components/store/product-details";
import RelatedProducts from "@/app/components/store/related-products";
import ReviewForm from "@/app/components/store/reviews/review-form";
import ReviewList from "@/app/components/store/reviews/review-list";
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

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id
  );

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

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
            <div className="bg-default-50 p-6 rounded-lg border border-divider">
              <ReviewForm productId={product.id} />
            </div>
          </div>
          <div className="lg:col-span-8">
            <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
            <ReviewList productId={product.id} />
          </div>
        </div>

        <RelatedProducts products={relatedProducts} />
      </main>
    </div>
  );
}
