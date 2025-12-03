import { createProduct } from "@/app/lib/actions/products";
import { getCategories } from "@/app/lib/actions/categories";
import { Button } from "@heroui/react";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form
        action={createProduct}
        className="flex flex-col gap-6 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Product Name</label>
          <input
            name="name"
            required
            className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
            placeholder="e.g. Classic T-Shirt"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
            placeholder="Product details..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
              placeholder="0.00"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Stock</label>
            <input
              name="stock"
              type="number"
              required
              className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Category</label>
          <select
            name="categoryId"
            required
            className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="text-xs text-amber-500">
              No categories found. Please create a category first.
            </p>
          )}
        </div>

        <Button type="submit" color="primary" className="mt-4">
          Create Product
        </Button>
      </form>
    </div>
  );
}
