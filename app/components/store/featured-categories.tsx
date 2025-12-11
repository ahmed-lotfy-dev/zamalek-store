"use client";

import {
  Card,
  CardHeader,
} from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FeaturedCategories({
  categories,
}: {
  categories: any[];
}) {
  const t = useTranslations("Categories");
  const locale = useLocale();

  // Map categories by English name for easy access
  const categoryMap = new Map(categories.map((c) => [c.nameEn, c]));

  const jerseys = categoryMap.get("Jerseys");
  const tShirts = categoryMap.get("T-Shirts");
  const accessories = categoryMap.get("Accessories");

  const orderedCategories = [
    {
      data: jerseys,
      displayName: t("jerseys"),
      size: "large",
    },
    {
      data: tShirts,
      displayName: t("tShirts"),
      size: "normal",
    },
    {
      data: accessories,
      displayName: t("accessories"),
      size: "normal",
    },
  ]
    .filter((item) => item.data) // Filter out missing categories
    .map((item) => ({
      id: item.data.id,
      name: item.displayName,
      image:
        item.data.products[0]?.images[0] ||
        "https://placehold.co/600x400?text=No+Image",
      href: `/products?category=${item.data.nameEn.toLowerCase().trim()}`,
      size: item.size,
    }));

  return (
    <section className="py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            {t("shopByCategory")}
          </h2>
          <p className="text-default-500">{t("findExactly")}</p>
        </div>
        <Button
          as={Link}
          href="/products"
          variant="light"
          color="primary"
          endContent={<ArrowRight size={16} />}
          className="font-medium"
        >
          {t("viewAll")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
        {orderedCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            className={category.size === "large" ? "md:col-span-2" : ""}
          >
            <Card
              isPressable
              as={Link}
              href={category.href}
              className="w-full h-full group border-none overflow-hidden shadow-none"
            >
              <Image
                removeWrapper
                alt={category.name}
                className="z-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                src={category.image}
              />
              {/* Sophisticated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90 z-10" />

              <CardHeader className="absolute bottom-0 z-20 flex-col items-start! p-8 w-full">
                <h3 className="text-white font-bold text-3xl mb-2 tracking-tight drop-shadow-md">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2 text-white/90 text-sm font-medium transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span>Shop Collection</span>
                  <ArrowRight size={16} />
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
