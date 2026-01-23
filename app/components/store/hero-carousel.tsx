"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeroSlide = {
  id: string;
  title: string | null;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  imageUrl: string;
  link: string | null;
};

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [current, setCurrent] = useState(0);
  const locale = useLocale();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[50vh] md:h-[600px] overflow-hidden bg-gray-100">
      <AnimatePresence mode="wait">
        {hasMounted && (
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="relative w-full h-full">
              <Image
                src={slides[current].imageUrl}
                alt="Hero Slide"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                <div className="max-w-3xl text-white space-y-4">
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold"
                  >
                    {locale === "en" ? slides[current].titleEn || slides[current].title : slides[current].title}
                  </motion.h2>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl text-white/90"
                  >
                    {locale === "en" ? slides[current].descriptionEn || slides[current].description : slides[current].description}
                  </motion.p>

                  {slides[current].link && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link href={slides[current].link}>
                        <Button size="lg" className="rounded-full px-8 text-lg">
                          {locale === "en" ? "Shop Now" : "تسوق الآن"}
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
          >
            <ChevronRight size={32} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === current ? "bg-white w-6" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
