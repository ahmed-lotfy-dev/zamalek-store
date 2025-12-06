"use client";

import { Select, SelectItem } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function SortSelect({
  sortOption,
  setSortOption,
}: {
  sortOption: string;
  setSortOption: (option: string) => void;
}) {
  const t = useTranslations("Product");

  const sortOptions = [
    { key: "newest", label: t("newest") },
    { key: "price_asc", label: t("priceLowHigh") },
    { key: "price_desc", label: t("priceHighLow") },
  ];

  return (
    <Select
      label={t("sortBy")}
      className="w-full sm:w-auto sm:min-w-[200px] outline-none"
      defaultSelectedKeys={[sortOption]}
      onChange={(e) => setSortOption(e.target.value)}
      size="sm"
      variant="faded"
    >
      {sortOptions.map((option) => (
        <SelectItem key={option.key}>{option.label}</SelectItem>
      ))}
    </Select>
  );
}
