"use client";

import { Slider } from "@heroui/slider";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { useTranslations, useLocale } from "next-intl";
import { useFormat } from "@/app/hooks/use-format";

export default function Filters({
  categories,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,
}: {
  categories: any[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  minPrice: number;
  maxPrice: number;
}) {
  const t = useTranslations("Product");
  const locale = useLocale();
  const { formatCurrency } = useFormat();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-large">{t("categories")}</h3>
        <CheckboxGroup
          value={selectedCategories}
          onValueChange={setSelectedCategories}
          color="primary"
        >
          {categories.map((category) => (
            <Checkbox
              key={category.id}
              value={
                category.nameEn
                  ? category.nameEn.toLowerCase().trim()
                  : category.name.toLowerCase().trim()
              }
            >
              {locale === "en"
                ? category.nameEn || category.name
                : category.name}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-large">{t("priceRange")}</h3>
        <Slider
          label={t("price")}
          step={1}
          minValue={minPrice}
          maxValue={maxPrice}
          value={priceRange}
          onChange={(value) => setPriceRange(value as number[])}
          formatOptions={{ style: "currency", currency: "EGP" }}
          className="w-full max-w-md"
        />
        <div className="flex justify-between text-small text-default-500">
          <span>{formatCurrency(priceRange[0])}</span>
          <span>{formatCurrency(priceRange[1])}</span>
        </div>
      </div>
    </div>
  );
}
