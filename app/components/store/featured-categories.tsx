"use client";

import * as React from "react";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/app/lib/utils";

export default function FeaturedCategories({
  categories,
}: {
  categories: any[];
}) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const t = useTranslations("Categories");

  // Map categories by English name for easy access
  const categoryMap = new Map(categories.map((c) => [c.nameEn, c]));

  const jerseys = categoryMap.get("Jerseys");
  const tShirts = categoryMap.get("T-Shirts");
  const accessories = categoryMap.get("Accessories");

  const items = [
    {
      data: jerseys,
      title: t("jerseys"),
      description: "Official Match Kits 2025",
      className: "md:col-span-2 md:row-span-2 min-h-[500px]",
      priority: true,
    },
    {
      data: tShirts,
      title: t("tShirts"),
      description: "Training & Casual Wear",
      className: "md:col-span-1 md:row-span-1 min-h-[250px]",
    },
    {
      data: accessories,
      title: t("accessories"),
      description: "Scarves, Caps & More",
      className: "md:col-span-1 md:row-span-1 min-h-[250px]",
    },
  ];

  return (
    <section className="py-24 container mx-auto px-6 max-w-7xl">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-8 bg-primary"></span>
            <span className="text-primary font-bold uppercase tracking-widest text-sm">Collections</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            {t("shopByCategory")}
          </h2>
        </div>
        <Link href="/products">
          <Button
            variant="ghost"
            className="group font-bold text-lg hover:bg-transparent hover:text-primary gap-2"
          >
            {t("viewAll")}
            <MoveRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => {
          if (!item.data) return null;

          return (
            <motion.div
              key={item.data.id}
              initial={hasMounted ? { opacity: 0, y: 30 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={item.className}
            >
              <Link href={`/products?category=${item.data.nameEn.toLowerCase().trim()}`} className="block w-full h-full">
                <Card className="w-full h-full group border-none overflow-hidden rounded-3xl relative">
                  <Image
                    alt={item.title}
                    src={item.data.products[0]?.images[0] || "https://placehold.co/600x400?text=No+Image"}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white z-20">
                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                      <p className="font-medium text-white/80 mb-2 tracking-wide uppercase text-sm">{item.description}</p>
                      <h3 className="text-4xl font-black tracking-tight mb-4">{item.title}</h3>
                      <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <span className="font-bold">Explore</span>
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
