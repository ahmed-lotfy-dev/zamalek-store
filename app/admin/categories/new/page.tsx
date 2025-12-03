import { createCategory } from "@/app/lib/actions/categories";
import { Button } from "@heroui/react";

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>

      <form
        action={createCategory}
        className="flex flex-col gap-6 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Category Name</label>
          <input
            name="name"
            required
            className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
            placeholder="e.g. Clothing"
          />
        </div>

        <Button type="submit" color="primary" className="mt-4">
          Create Category
        </Button>
      </form>
    </div>
  );
}
