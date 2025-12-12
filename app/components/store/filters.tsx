"use client";

import { useTranslations, useLocale } from "next-intl";
import { useFormat } from "@/app/hooks/use-format";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-lg">{t("categories")}</h3>
        <div className="space-y-3">
          {categories.map((category) => {
            const value = category.nameEn
              ? category.nameEn.toLowerCase().trim()
              : category.name.toLowerCase().trim();
            return (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(value)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {locale === "en"
                    ? category.nameEn || category.name
                    : category.name}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-lg">{t("priceRange")}</h3>
        <Label className="text-sm text-muted-foreground">{t("price")}</Label>
        <Slider
          defaultValue={[minPrice, maxPrice]}
          min={minPrice}
          max={maxPrice}
          step={1}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatCurrency(priceRange[0])}</span>
          <span>{formatCurrency(priceRange[1])}</span>
        </div>
      </div>
    </div>
  );
}
