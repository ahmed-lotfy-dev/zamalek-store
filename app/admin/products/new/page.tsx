import { getCategories } from "@/app/lib/actions/categories";
import ProductForm from "./product-form";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
