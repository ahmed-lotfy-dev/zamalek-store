import { getCategories } from "@/app/lib/actions/categories";
import CategoryList from "./category-list";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <CategoryList categories={categories} />;
}
