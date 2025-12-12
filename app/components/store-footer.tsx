"use client";

import { Facebook, Twitter, Instagram, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import NewsletterForm from "@/app/components/newsletter-form";
import { Separator } from "@/components/ui/separator";

export default function StoreFooter() {
  const t = useTranslations("Footer");
  const tHome = useTranslations("HomePage");

  return (
    <footer className="bg-background border-t border-border mt-auto">
      {/* Trust Signals Strip */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-6 max-w-7xl py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h4 className="font-bold text-sm uppercase tracking-wide">Secure Payments</h4>
              <p className="text-xs text-muted-foreground">Certified 100% Secure Checkout</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Truck className="h-8 w-8 text-primary" />
              <h4 className="font-bold text-sm uppercase tracking-wide">Fast Shipping</h4>
              <p className="text-xs text-muted-foreground">Delivery across all Governorates</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CreditCard className="h-8 w-8 text-primary" />
              <h4 className="font-bold text-sm uppercase tracking-wide">Flexible Payment</h4>
              <p className="text-xs text-muted-foreground">Cash on Delivery & Online Payment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <h3 className="text-3xl font-black italic tracking-tighter">{tHome("title").toUpperCase()}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{t("description")}</p>
            <div className="flex gap-4">
              <Link href="#" aria-label="Facebook" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-all">
                <Facebook size={18} />
              </Link>
              <Link href="#" aria-label="Twitter" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-all">
                <Twitter size={18} />
              </Link>
              <Link href="#" aria-label="Instagram" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-all">
                <Instagram size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-wider">{t("shop")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-[2px] w-0 bg-primary group-hover:w-3 transition-all"></span>
                  {t("allProducts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessories"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="h-[2px] w-0 bg-primary group-hover:w-3 transition-all"></span>
                  {t("accessories")}
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="h-[2px] w-0 bg-primary group-hover:w-3 transition-all"></span>
                  {t("newArrivals")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-wider">{t("support")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("shippingPolicy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("returns")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("faqs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-wider">{t("stayUpdated")}</h4>
            <p className="text-muted-foreground text-sm">{t("newsletterDesc")}</p>
            <div className="bg-muted/50 p-4 rounded-xl border border-border">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            {t.rich("copyright", {
              year: new Date().getFullYear(),
            })}
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground font-medium uppercase tracking-wide">
            <Link href="#" className="hover:text-primary transition-colors">
              {t("privacyPolicy")}
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
