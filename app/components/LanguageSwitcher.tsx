"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@heroui/react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Language");

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={toggleLocale}
      aria-label="Switch Language"
    >
      <span className="font-bold">{locale === "en" ? "AR" : "EN"}</span>
    </Button>
  );
}
