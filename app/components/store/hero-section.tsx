"use client";

import { Button, Link } from "@heroui/react";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-zinc-900 text-white rounded-3xl">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop"
          alt="Zamalek Store Hero"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Wear the Legacy. <br />
            <span className="text-primary">Support the White Knights.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300 mb-8">
            Official Zamalek SC merchandise. From match kits to casual wear,
            represent your club with pride and style.
          </p>
          <div className="flex gap-4">
            <Button
              as={Link}
              href="/products"
              color="primary"
              size="lg"
              radius="full"
              className="font-semibold px-8"
            >
              Shop Now
            </Button>
            <Button
              as={Link}
              href="/products"
              variant="bordered"
              className="text-white border-white"
              size="lg"
              radius="full"
            >
              View Collection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
