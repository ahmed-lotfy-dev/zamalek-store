import { getOrder } from "@/app/lib/actions/orders";
import OrderDetails from "./order-details";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-default-500 hover:text-foreground transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Orders
        </Link>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>
      <OrderDetails order={order} />
    </div>
  );
}
