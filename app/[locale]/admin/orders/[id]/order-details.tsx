"use client";

import { useRouter } from "next/navigation";
import OrderStatusSelect from "../order-status-select";
import { Card, CardContent, CardFooter, CardHeader, Divider, Image } from "@heroui/react";

export default function OrderDetails({ order }: { order: any }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      {/* Order Info & Status */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Order #{order.id.slice(0, 8)}</h2>
            <p className="text-small text-default-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="w-48">
            <OrderStatusSelect
              orderId={order.id}
              currentStatus={order.status}
            />
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Details</h3>
              <p>{order.user.name}</p>
              <p className="text-default-500">{order.user.email}</p>
              <p className="text-default-500">{order.phone || "No phone"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="whitespace-pre-wrap">
                {order.address || "No address provided"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Order Items</h3>
        </CardHeader>
        <Divider />
        <CardContent>
          <div className="flex flex-col gap-4">
            {order.orderItems.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b border-default-100 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex gap-4 items-center">
                  {item.product.images[0] && (
                    <Image
                      alt={item.product.name}
                      className="object-cover rounded-lg"
                      height={64}
                      src={item.product.images[0]}
                      width={64}
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-small text-default-500">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="font-semibold">
                  ${Number(item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <Divider />
        <CardFooter className="justify-end">
          <div className="flex gap-8 items-center">
            <span className="text-default-500">Total</span>
            <span className="text-xl font-bold">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
