import { getPaginatedCategories } from "@/app/lib/actions/categories";
import CategoryList from "./category-list";
import PaginationControl from "@/app/components/admin/pagination-control";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { categories, metadata } = await getPaginatedCategories(currentPage);

  return (
    <div className="flex flex-col gap-4">
      <CategoryList categories={categories} />
      <PaginationControl
        totalCount={metadata.totalCount}
        pageSize={metadata.limit}
        currentPage={metadata.currentPage}
      />
    </div>
  );
}
