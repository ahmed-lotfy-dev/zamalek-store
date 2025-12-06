import { getOrders } from "@/app/lib/actions/orders";
import OrderList from "./order-list";
import PaginationControl from "@/app/components/admin/pagination-control";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { orders, metadata } = await getOrders(currentPage);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <OrderList orders={orders} />
      <PaginationControl
        totalCount={metadata.totalCount}
        pageSize={metadata.limit}
        currentPage={metadata.currentPage}
      />
    </div>
  );
}
