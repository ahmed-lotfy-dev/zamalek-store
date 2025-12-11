"use client";

import { createCategory } from "@/app/lib/actions/categories";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button"

export default function CategoryForm() {
  return (
    <form
      action={createCategory}
      className="flex flex-col gap-6 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex flex-col gap-2">
        <Input
          label="Category Name"
          name="name"
          isRequired
          placeholder="e.g. Clothing"
          variant="bordered"
        />
      </div>

      <Button type="submit" color="primary" className="mt-4">
        Create Category
      </Button>
    </form>
  );
}
