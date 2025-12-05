"use client";

import { useState } from "react";
import { createProduct, updateProduct } from "@/app/lib/actions/products";
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { Plus, Trash } from "lucide-react";

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
  variants?: {
    id?: string;
    color: string;
    size: string;
    stock: number;
  }[];
};

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const [variants, setVariants] = useState<
    { id?: string; color: string; size: string; stock: number }[]
  >(product?.variants || []);

  const action = product ? updateProduct.bind(null, product.id) : createProduct;

  const addVariant = () => {
    setVariants([...variants, { color: "", size: "", stock: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: "color" | "size" | "stock",
    value: string | number
  ) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

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
            label="Total Stock"
            name="stock"
            defaultValue={product?.stock.toString()}
            type="number"
            isRequired
            placeholder="0"
            variant="bordered"
            description="If variants are added, this can be the sum or a general stock."
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

      {/* Variants Section */}
      <div className="flex flex-col gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Variants</h3>
          <Button
            size="sm"
            variant="flat"
            color="primary"
            startContent={<Plus size={16} />}
            onPress={addVariant}
            type="button"
          >
            Add Variant
          </Button>
        </div>

        {variants.length === 0 && (
          <p className="text-sm text-default-500 italic">
            No variants added. Product will be treated as a single item.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {variants.map((variant, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Input
                placeholder="Color"
                value={variant.color}
                onChange={(e) => updateVariant(index, "color", e.target.value)}
                size="sm"
                variant="bordered"
                className="flex-1"
              />
              <Input
                placeholder="Size"
                value={variant.size}
                onChange={(e) => updateVariant(index, "size", e.target.value)}
                size="sm"
                variant="bordered"
                className="flex-1"
              />
              <Input
                placeholder="Stock"
                type="number"
                value={variant.stock.toString()}
                onChange={(e) =>
                  updateVariant(index, "stock", parseInt(e.target.value) || 0)
                }
                size="sm"
                variant="bordered"
                className="w-24"
              />
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="light"
                onPress={() => removeVariant(index)}
                type="button"
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}
        </div>

        {/* Hidden input to submit variants */}
        <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      </div>

      <Button type="submit" color="primary" className="mt-4">
        {product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
