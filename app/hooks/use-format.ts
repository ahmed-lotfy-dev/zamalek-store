import { useFormatter, useLocale } from "next-intl";

export function useFormat() {
  const format = useFormatter();
  const locale = useLocale();

  const formatCurrency = (amount: number) => {
    // User requested EGP globally for now
    const currency = "EGP";
    return format.number(amount, {
      style: "currency",
      currency,
      numberingSystem: locale === "ar" ? "arab" : "latn",
    });
  };

  const formatNumber = (number: number) => {
    return format.number(number, {
      numberingSystem: locale === "ar" ? "arab" : "latn",
    });
  };

  const formatDate = (date: Date | string | number) => {
    return format.dateTime(new Date(date), {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      numberingSystem: locale === "ar" ? "arab" : "latn",
    });
  };

  return { formatCurrency, formatNumber, formatDate };
}
