"use client";

import { createCategory, updateCategory } from "@/app/lib/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      className="flex flex-col gap-6 bg-card p-6 rounded-xl shadow-sm border"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Category Name</Label>
          <Input
            name="name"
            defaultValue={category?.name}
            placeholder="e.g. Electronics"
            required
          />
        </div>

        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          folder="categories"
          label="Category Image"
        />
        <input type="hidden" name="image" value={imageUrl} />
      </div>

      <Button type="submit" className="mt-4">
        {category ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
}
