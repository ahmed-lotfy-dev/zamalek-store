"use client";

import { CheckboxGroup, Checkbox, Slider } from "@heroui/react";

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
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-large">Categories</h3>
        <CheckboxGroup
          value={selectedCategories}
          onValueChange={setSelectedCategories}
          color="primary"
        >
          {categories.map((category) => (
            <Checkbox key={category.id} value={category.id}>
              {category.name}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-large">Price Range</h3>
        <Slider
          label="Price"
          step={1}
          minValue={minPrice}
          maxValue={maxPrice}
          value={priceRange}
          onChange={(value) => setPriceRange(value as number[])}
          formatOptions={{ style: "currency", currency: "USD" }}
          className="w-full max-w-md"
        />
        <div className="flex justify-between text-small text-default-500">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
}
