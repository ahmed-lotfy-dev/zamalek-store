import { getNewArrivals } from "@/app/lib/actions/products";
import StoreNavbar from "@/app/components/store-navbar";
import NewArrivals from "@/app/components/store/new-arrivals";
import HeroSection from "@/app/components/store/hero-section";
import FeaturedCategories from "@/app/components/store/featured-categories";

export default async function Home() {
  const newArrivals = await getNewArrivals();

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16">
          {/* Hero Section */}
          <HeroSection />

          {/* Featured Categories */}
          <FeaturedCategories />

          {/* New Arrivals Section */}
          <NewArrivals
            products={newArrivals.map((p) => ({
              ...p,
              price: Number(p.price),
            }))}
          />
        </div>
      </main>
    </div>
  );
}
