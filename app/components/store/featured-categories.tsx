"use client";

import { Card, CardFooter, Image, Button, Link } from "@heroui/react";

const categories = [
  {
    id: "jerseys",
    name: "Official Kits",
    image:
      "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60",
    href: "/products?category=jerseys",
  },
  {
    id: "t-shirts",
    name: "Casual Wear",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=60",
    href: "/products?category=t-shirts",
  },
  {
    id: "accessories",
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1559563458-527698bf5295?w=800&auto=format&fit=crop&q=60",
    href: "/products?category=accessories",
  },
];

export default function FeaturedCategories() {
  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <p className="text-default-500 mt-1">
            Find exactly what you&apos;re looking for.
          </p>
        </div>
        <Button
          as={Link}
          href="/products"
          variant="light"
          color="primary"
          className="font-medium"
        >
          View All Categories
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            isPressable
            as={Link}
            href={category.href}
            className="h-[300px] w-full group"
          >
            <Image
              removeWrapper
              alt={category.name}
              className="z-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              src={category.image}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
            <CardFooter className="absolute bottom-0 z-20 justify-between border-t-1 border-zinc-100/50 bg-white/10 shadow-small mb-4 mx-4 w-[calc(100%-32px)] rounded-large overflow-hidden py-2 before:rounded-xl before:bg-white/10">
              <p className="text-white font-bold text-lg">{category.name}</p>
              <Button
                className="text-tiny text-white bg-black/20"
                variant="flat"
                color="default"
                radius="lg"
                size="sm"
              >
                Shop Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
