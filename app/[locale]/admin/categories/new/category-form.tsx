"use client";

import { createCategory } from "@/app/lib/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CategoryForm() {
  return (
    <form
      action={createCategory}
      className="flex flex-col gap-6 bg-card p-6 rounded-xl shadow-sm border border-border"
    >
      <div className="flex flex-col gap-2">
        <Label>Category Name <span className="text-destructive">*</span></Label>
        <Input
          name="name"
          placeholder="e.g. Clothing"
          required
        />
      </div>

      <Button type="submit" className="mt-4">
        Create Category
      </Button>
    </form>
  );
}
