"use client";

import { Select, SelectItem } from "@heroui/react";

export const sortOptions = [
  { key: "newest", label: "Newest" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
];

export default function SortSelect({
  sortOption,
  setSortOption,
}: {
  sortOption: string;
  setSortOption: (option: string) => void;
}) {
  return (
    <Select
      label="Sort by"
      className="max-w-xs outline-none"
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
