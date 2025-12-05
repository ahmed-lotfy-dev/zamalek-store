import { getPaginatedProducts } from "@/app/lib/actions/products";
import ProductList from "./product-list";
import PaginationControl from "@/app/components/admin/pagination-control";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { products, metadata } = await getPaginatedProducts(currentPage);

  return (
    <div className="flex flex-col gap-4">
      <ProductList
        products={products.map((p: any) => ({ ...p, price: Number(p.price) }))}
      />
      <PaginationControl
        totalCount={metadata.totalCount}
        pageSize={metadata.limit}
        currentPage={metadata.currentPage}
      />
    </div>
  );
}
