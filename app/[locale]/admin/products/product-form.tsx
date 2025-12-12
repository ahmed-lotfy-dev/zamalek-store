"use client";

import { useState } from "react";
import { createProduct, updateProduct } from "@/app/lib/actions/products";
import { translateText } from "@/app/lib/actions/translate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Trash, Languages } from "lucide-react";
import { toast } from "sonner";
import MultiImageUpload from "@/app/components/admin/multi-image-upload";
import { cn } from "@/app/lib/utils"

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
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.categoryId || "");

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
      className="flex flex-col gap-6 bg-card p-6 rounded-xl shadow-sm border"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Product Details</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAutoTranslate}
          disabled={isTranslating}
          className="flex items-center gap-2"
          type="button"
        >
          <Languages size={16} />
          {isTranslating ? "Translating..." : "Auto-Translate to English"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Product Name (Arabic)</Label>
          <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المنتج"
            required
          />
          <span className="text-xs text-muted-foreground">Primary name in Arabic</span>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Product Name (English)</Label>
          <Input
            name="nameEn"
            value={nameEn || ""}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="Product Name"
          />
          <span className="text-xs text-muted-foreground">Optional English translation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Description (Arabic) *</Label>
          <Textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف المنتج..."
            rows={4}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Description (English)</Label>
          <Textarea
            name="descriptionEn"
            value={descriptionEn || ""}
            onChange={(e) => setDescriptionEn(e.target.value)}
            placeholder="Product description..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <MultiImageUpload
          value={images}
          onChange={setImages}
          folder="products"
          label="Product Images"
        />
        <input type="hidden" name="images" value={JSON.stringify(images)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Price ($)</Label>
          <Input
            name="price"
            defaultValue={product?.price.toString()}
            type="number"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Total Stock</Label>
          <Input
            name="stock"
            defaultValue={product?.stock.toString()}
            type="number"
            placeholder="0"
            required
          />
          <span className="text-xs text-muted-foreground">If variants are added, this can be the sum or a general stock.</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Category *</Label>
        <Select name="categoryId" value={selectedCategory} onValueChange={setSelectedCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {categories.length === 0 && (
          <p className="text-xs text-amber-500">
            No categories found. Please create a category first.
          </p>
        )}
      </div>

      {/* Variants Section */}
      <div className="flex flex-col gap-4 border-t pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Variants</h3>
          <Button
            size="sm"
            variant="secondary"
            onClick={addVariant}
            type="button"
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Variant
          </Button>
        </div>

        {variants.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
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
                className="flex-1"
              />
              <Input
                placeholder="Size"
                value={variant.size}
                onChange={(e) => updateVariant(index, "size", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Stock"
                type="number"
                value={variant.stock.toString()}
                onChange={(e) =>
                  updateVariant(index, "stock", parseInt(e.target.value) || 0)
                }
                className="w-24"
              />
              <Button
                size="icon"
                variant="destructive"
                onClick={() => removeVariant(index)}
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

      <Button type="submit" className="mt-4">
        {product ? "Update Product" : "Create Product"}
      </Button>
    </form >
  );
}
