import { getOrders } from "@/app/lib/actions/orders";
import OrderList from "./order-list";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <OrderList orders={orders} />
    </div>
  );
}
