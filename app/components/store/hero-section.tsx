"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";

export default function HeroSection() {
  const t = useTranslations("HomePage");

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden rounded-3xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop"
          alt="Zamalek Store Hero"
          className="h-full w-full object-cover"
        />
        {/* Overlay Gradient - Cinematic Look */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl mb-6 leading-[1.1]">
              {t("heroTitle")} <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-white">
                {t("heroSubtitle")}
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-200 mb-10 max-w-lg font-light">
              {t("welcome")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                as={Link}
                href="/products"
                color="primary"
                size="lg"
                radius="full"
                className="font-bold px-10 text-lg h-14 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                {t("shopNow")}
              </Button>
              <Button
                as={Link}
                href="/products"
                variant="bordered"
                className="text-white border-white/30 backdrop-blur-md font-bold px-10 text-lg h-14 hover:bg-white/10 hover:border-white transition-all"
                size="lg"
                radius="full"
              >
                {t("featuredCategories")}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
