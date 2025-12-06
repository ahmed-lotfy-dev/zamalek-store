import { getNewArrivals } from "@/app/lib/actions/products";
import { getSavedItems } from "@/app/lib/actions/saved-items";
import { getCategoriesWithImages } from "@/app/lib/actions/categories";
import NewArrivals from "@/app/components/store/new-arrivals";
import HeroSection from "@/app/components/store/hero-section";
import FeaturedCategories from "@/app/components/store/featured-categories";
import FeaturesSection from "@/app/components/store/features-section";
import PromoBanner from "@/app/components/store/promo-banner";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [newArrivals, savedItems, categories] = await Promise.all([
    getNewArrivals(),
    getSavedItems(),
    getCategoriesWithImages(),
  ]);

  const savedItemIds = savedItems.map(
    (item: { productId: string }) => item.productId
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16">
          {/* Hero Section */}
          <HeroSection />

          {/* Features / Trust Signals */}
          <FeaturesSection />

          {/* Featured Categories */}
          <FeaturedCategories categories={categories} />

          {/* Promotional Banner */}
          <PromoBanner />

          {/* New Arrivals Section */}
          <NewArrivals
            products={newArrivals.map((p: any) => ({
              ...p,
              price: Number(p.price),
            }))}
            savedItemIds={savedItemIds}
          />
        </div>
      </main>
    </div>
  );
}
