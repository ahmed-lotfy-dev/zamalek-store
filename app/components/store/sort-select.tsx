"use client";

import { useTranslations } from "next-intl";
import { Select, ListBox, Label } from "@heroui/react";

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
      selectedKey={sortOption}
      onSelectionChange={(keys) => {
        if (keys && keys !== "all") {
          const selected = Array.from(keys as unknown as Set<string>)[0];
          setSortOption(selected);
        }
      }}
      placeholder={t("sortBy")}
      className="w-full sm:w-auto sm:min-w-[200px]"
    >
      <Label>{t("sortBy")}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {sortOptions.map((option) => (
            <ListBox.Item key={option.key} id={option.key} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
