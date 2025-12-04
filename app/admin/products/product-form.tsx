"use client";

import { createProduct, updateProduct } from "@/app/lib/actions/products";
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
};

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const action = product ? updateProduct.bind(null, product.id) : createProduct;

  return (
    <form
      action={action}
      className="flex flex-col gap-6 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex flex-col gap-2">
        <Input
          label="Product Name"
          name="name"
          defaultValue={product?.name}
          isRequired
          placeholder="e.g. Classic T-Shirt"
          variant="bordered"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Textarea
          label="Description"
          name="description"
          defaultValue={product?.description}
          isRequired
          placeholder="Product details..."
          variant="bordered"
          minRows={4}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Input
          label="Image URL"
          name="imageUrl"
          defaultValue={product?.images[0]}
          type="url"
          placeholder="https://example.com/image.jpg"
          variant="bordered"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Input
            label="Price ($)"
            name="price"
            defaultValue={product?.price.toString()}
            type="number"
            step="0.01"
            isRequired
            placeholder="0.00"
            variant="bordered"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Input
            label="Stock"
            name="stock"
            defaultValue={product?.stock.toString()}
            type="number"
            isRequired
            placeholder="0"
            variant="bordered"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Select
          label="Category"
          name="categoryId"
          defaultSelectedKeys={product ? [product.categoryId] : []}
          isRequired
          placeholder="Select a category"
          variant="bordered"
        >
          {categories.map((category) => (
            <SelectItem key={category.id}>{category.name}</SelectItem>
          ))}
        </Select>
        {categories.length === 0 && (
          <p className="text-xs text-amber-500">
            No categories found. Please create a category first.
          </p>
        )}
      </div>

      <Button type="submit" color="primary" className="mt-4">
        {product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
