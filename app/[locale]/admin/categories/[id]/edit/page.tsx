import { prisma } from "@/app/lib/prisma";
import CategoryForm from "../../category-form";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
}
