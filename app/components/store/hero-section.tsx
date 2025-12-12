"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("HomePage");

  return (
    <div className="relative h-[90vh] w-full overflow-hidden rounded-b-[3rem] shadow-2xl">
      {/* Background Image - Parallax Effect would go here */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop"
          alt="Zamalek Store Hero"
          className="h-full w-full object-cover scale-105 animate-in-fade duration-[2s]"
        />
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 h-full flex flex-col justify-center pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                Official Season 2025
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
              {t("heroTitle")} <br />
              <span className="text-primary">
                {t("heroSubtitle")}
              </span>
            </h1>
            <p className="mt-4 text-xl md:text-2xl leading-relaxed text-gray-200 mb-10 max-w-xl font-medium opacity-90">
              {t("welcome")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="font-bold px-12 text-lg h-16 rounded-full shadow-[0_0_40px_-10px_rgba(227,6,19,0.5)] hover:shadow-[0_0_60px_-10px_rgba(227,6,19,0.7)] transition-all duration-300 transform hover:-translate-y-1"
                >
                  {t("shopNow")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products?category=jerseys">
                <Button
                  variant="outline"
                  className="bg-white/5 backdrop-blur-xl text-white border-white/20 font-bold px-10 text-lg h-16 rounded-full hover:bg-white/10 hover:border-white/40 transition-all"
                  size="lg"
                >
                  Browse Kits
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 z-20 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-linear-to-b from-white/50 to-transparent" />
      </motion.div>
    </div>
  );
}
