import CategoryForm from "./category-form";

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>
      <CategoryForm />
    </div>
  );
}
