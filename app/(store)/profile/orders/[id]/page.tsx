import { getUserOrder } from "@/app/lib/actions/profile";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import { ArrowLeft, MapPin, Phone, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";

import { getStatusColor } from "@/app/lib/utils";
import OrderStatusListener from "@/app/components/store/order-status-listener";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getUserOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <OrderStatusListener orderId={order.id} />
      <div className="flex items-center gap-4">
        <Button
          as={Link}
          href="/profile/orders"
          isIconOnly
          variant="light"
          className="min-w-10 w-10 h-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Order #{order.id.slice(-6)}
            <Chip color={getStatusColor(order.status)} variant="flat">
              {order.status}
            </Chip>
          </h1>
          <p className="text-default-500 text-sm">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-0 pt-4 px-4">
              <h2 className="text-lg font-bold">Items</h2>
            </CardHeader>
            <CardBody className="py-4">
              <div className="space-y-4">
                {order.orderItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-default-100 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        classNames={{
                          wrapper: "w-full h-full",
                          img: "w-full h-full object-cover",
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-default-500 text-sm">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <Divider className="my-4" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Order Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-0 pt-4 px-4">
              <h2 className="text-lg font-bold">Shipping Details</h2>
            </CardHeader>
            <CardBody className="py-4 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-default-500 mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-default-500 text-sm">{order.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-default-500 mt-0.5" />
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p className="text-default-500 text-sm">{order.phone}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="pb-0 pt-4 px-4">
              <h2 className="text-lg font-bold">Payment Info</h2>
            </CardHeader>
            <CardBody className="py-4">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-default-500 mt-0.5" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-default-500 text-sm">Cash on Delivery</p>
                  <Chip
                    size="sm"
                    color={order.isPaid ? "success" : "warning"}
                    variant="dot"
                    className="mt-2"
                  >
                    {order.isPaid ? "Paid" : "Pending Payment"}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
