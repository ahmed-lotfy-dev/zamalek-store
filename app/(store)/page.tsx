import { getNewArrivals } from "@/app/lib/actions/products";
import { getSavedItems } from "@/app/lib/actions/saved-items";
import NewArrivals from "@/app/components/store/new-arrivals";
import HeroSection from "@/app/components/store/hero-section";
import FeaturedCategories from "@/app/components/store/featured-categories";

export default async function Home() {
  const [newArrivals, savedItems] = await Promise.all([
    getNewArrivals(),
    getSavedItems(),
  ]);

  const savedItemIds = savedItems.map(
    (item: { productId: string }) => item.productId
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16">
          {/* Hero Section */}
          <HeroSection />

          {/* Featured Categories */}
          <FeaturedCategories />

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
