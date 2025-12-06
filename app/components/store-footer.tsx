"use client";

import { Link as HeroLink } from "@heroui/link";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import NewsletterForm from "@/app/components/newsletter-form";

export default function StoreFooter() {
  const t = useTranslations("Footer");
  const tHome = useTranslations("HomePage");

  return (
    <footer className="bg-content1 border-t border-divider pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{tHome("title")}</h3>
            <p className="text-default-500 text-sm">{t("description")}</p>
            <div className="flex gap-4">
              <HeroLink href="#" color="foreground" aria-label="Facebook">
                <Facebook size={20} />
              </HeroLink>
              <HeroLink href="#" color="foreground" aria-label="Twitter">
                <Twitter size={20} />
              </HeroLink>
              <HeroLink href="#" color="foreground" aria-label="Instagram">
                <Instagram size={20} />
              </HeroLink>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-large">{t("shop")}</h4>
            <ul className="space-y-2 text-sm text-default-500">
              <li>
                <Link href="/products" className="text-foreground">
                  {t("allProducts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessories"
                  className="text-foreground"
                >
                  {t("accessories")}
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="text-foreground">
                  {t("newArrivals")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-large">{t("support")}</h4>
            <ul className="space-y-2 text-sm text-default-500">
              <li>
                <Link href="#" className="text-foreground">
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground">
                  {t("shippingPolicy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground">
                  {t("returns")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground">
                  {t("faqs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-large">{t("stayUpdated")}</h4>
            <p className="text-default-500 text-sm">{t("newsletterDesc")}</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-small text-default-400">
            {t.rich("copyright", {
              year: new Date().getFullYear(),
            })}
          </p>
          <div className="flex gap-6 text-small text-default-400">
            <Link href="#" className="text-foreground text-small">
              {t("privacyPolicy")}
            </Link>
            <Link href="#" className="text-foreground text-small">
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
