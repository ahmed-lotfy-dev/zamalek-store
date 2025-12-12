"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-black">
      <div className="absolute inset-0 opacity-60">
        <img
          src="https://images.unsplash.com/photo-1517466787929-bc90951d64b8?q=80&w=2000&auto=format&fit=crop"
          alt="Training Collection"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
          Train Like a Pro
        </h2>
        <p className="mx-auto max-w-xl text-lg text-gray-300 mb-8">
          Discover our new training collection designed for performance and
          comfort. Get ready for the season with the official gear.
        </p>
        <Link href="/products?category=training">
          <Button
            size="lg"
            className="font-semibold px-8 rounded-full"
          >
            Shop Training Gear
          </Button>
        </Link>
      </div>
    </section>
  );
}
