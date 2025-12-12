"use client";

import { Facebook, Twitter, Instagram } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import NewsletterForm from "@/app/components/newsletter-form";

export default function StoreFooter() {
  const t = useTranslations("Footer");
  const tHome = useTranslations("HomePage");

  return (
    <footer className="bg-muted/50 border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{tHome("title")}</h3>
            <p className="text-muted-foreground text-sm">{t("description")}</p>
            <div className="flex gap-4">
              <Link href="#" aria-label="Facebook" className="text-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t("shop")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="text-foreground hover:text-primary transition-colors">
                  {t("allProducts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessories"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {t("accessories")}
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="text-foreground hover:text-primary transition-colors">
                  {t("newArrivals")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t("support")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="text-foreground hover:text-primary transition-colors">
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary transition-colors">
                  {t("shippingPolicy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary transition-colors">
                  {t("returns")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground hover:text-primary transition-colors">
                  {t("faqs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t("stayUpdated")}</h4>
            <p className="text-muted-foreground text-sm">{t("newsletterDesc")}</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t.rich("copyright", {
              year: new Date().getFullYear(),
            })}
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              {t("privacyPolicy")}
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
