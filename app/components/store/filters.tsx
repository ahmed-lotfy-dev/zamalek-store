"use client";

import { CheckboxGroup, Checkbox } from "@heroui/react";

export default function Filters({
  categories,
  selectedCategories,
  setSelectedCategories,
}: {
  categories: any[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  return (
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
  );
}
