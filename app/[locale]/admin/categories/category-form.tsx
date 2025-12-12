'use client'
import { createCategory, updateCategory } from "@/app/lib/actions/categories";
import { Button, Input } from "@heroui/react";

import ImageUpload from "@/app/components/admin/image-upload";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  image?: string | null;
};

export default function CategoryForm({ category }: { category?: Category }) {
  const [imageUrl, setImageUrl] = useState(category?.image || "");

  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;

  return (
    <form
      action={action}
      className="flex flex-col gap-6 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Category Name"
          name="name"
          defaultValue={category?.name}
          isRequired
          placeholder="e.g. Electronics"
          variant="bordered"
        />

        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          folder="categories"
          label="Category Image"
        />
        <input type="hidden" name="image" value={imageUrl} />
      </div>

      <Button type="submit" color="primary" className="mt-4">
        {category ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
}
