"use client";

import { createCategory, updateCategory } from "@/app/lib/actions/categories";
import { Button, Input } from "@heroui/react";

type Category = {
  id: string;
  name: string;
};

export default function CategoryForm({ category }: { category?: Category }) {
  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;

  return (
    <form
      action={action}
      className="flex flex-col gap-6 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex flex-col gap-2">
        <Input
          label="Category Name"
          name="name"
          defaultValue={category?.name}
          isRequired
          placeholder="e.g. Electronics"
          variant="bordered"
        />
      </div>

      <Button type="submit" color="primary" className="mt-4">
        {category ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
}
