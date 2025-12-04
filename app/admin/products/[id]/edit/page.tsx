import { getCategories } from "@/app/lib/actions/categories";
import { prisma } from "@/app/lib/prisma";
import ProductForm from "../../product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
    }),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm
        categories={categories}
        product={{
          ...product,
          price: Number(product.price),
        }}
      />
    </div>
  );
}
