"use client";

import { useState } from "react";
import { createProduct, updateProduct } from "@/app/lib/actions/products";
import { translateText } from "@/app/lib/actions/translate";
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { Plus, Trash, Languages } from "lucide-react";
import { toast } from "@/app/components/ui/toast";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  nameEn?: string | null;
  description: string;
  descriptionEn?: string | null;
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
  const [isTranslating, setIsTranslating] = useState(false);
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [nameEn, setNameEn] = useState(product?.nameEn || "");
  const [descriptionEn, setDescriptionEn] = useState(
    product?.descriptionEn || ""
  );

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

  const handleAutoTranslate = async () => {
    if (!name && !description) {
      toast.error("Please enter Arabic name or description first");
      return;
    }

    setIsTranslating(true);
    try {
      if (name && !nameEn) {
        const translatedName = await translateText(name, "ar", "en");
        if (translatedName) setNameEn(translatedName);
      }

      if (description && !descriptionEn) {
        const translatedDesc = await translateText(description, "ar", "en");
        if (translatedDesc) setDescriptionEn(translatedDesc);
      }
      toast.success("Translation complete!");
    } catch (error) {
      console.error("Translation failed", error);
      toast.error("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <form
      action={action}
      className="flex flex-col gap-6 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Product Details</h2>
        <Button
          size="sm"
          color="secondary"
          variant="flat"
          startContent={<Languages size={16} />}
          onPress={handleAutoTranslate}
          isLoading={isTranslating}
        >
          Auto-Translate to English
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Input
            label="Product Name (Arabic)"
            name="name"
            value={name}
            onValueChange={setName}
            isRequired
            placeholder="اسم المنتج"
            variant="bordered"
            description="Primary name in Arabic"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            label="Product Name (English)"
            name="nameEn"
            value={nameEn || ""}
            onValueChange={setNameEn}
            placeholder="Product Name"
            variant="bordered"
            description="Optional English translation"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Textarea
            label="Description (Arabic)"
            name="description"
            value={description}
            onValueChange={setDescription}
            isRequired
            placeholder="وصف المنتج..."
            variant="bordered"
            minRows={4}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Textarea
            label="Description (English)"
            name="descriptionEn"
            value={descriptionEn || ""}
            onValueChange={setDescriptionEn}
            placeholder="Product description..."
            variant="bordered"
            minRows={4}
          />
        </div>
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
