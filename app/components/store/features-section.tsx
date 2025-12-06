"use client";

import { Truck, ShieldCheck, RefreshCw, Award } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FeaturesSection() {
  const t = useTranslations("HomePage");

  const features = [
    {
      icon: Award,
      title: t("officialMerch"),
      description: t("officialMerchDesc"),
    },
    {
      icon: Truck,
      title: t("fastShipping"),
      description: t("fastShippingDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("securePayment"),
      description: t("securePaymentDesc"),
    },
    {
      icon: RefreshCw,
      title: t("easyReturns"),
      description: t("easyReturnsDesc"),
    },
  ];

  return (
    <section className="py-16 bg-content2/30 rounded-3xl my-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 rounded-2xl bg-primary/10 p-4 text-primary ring-1 ring-primary/20">
                <feature.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-base leading-7 text-default-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
