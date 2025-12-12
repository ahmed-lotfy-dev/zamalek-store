"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
    <div className="flex items-center gap-2">
      <Label className="hidden sm:block whitespace-nowrap">{t("sortBy")}</Label>
      <Select value={sortOption} onValueChange={setSortOption}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("sortBy")} />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
