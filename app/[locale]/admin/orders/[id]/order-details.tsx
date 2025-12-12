"use client";

import OrderStatusSelect from "../order-status-select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function OrderDetails({ order }: { order: any }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Order Info & Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-bold">Order #{order.id.slice(0, 8)}</CardTitle>
            <CardDescription>
              Placed on {new Date(order.createdAt).toLocaleString()}
            </CardDescription>
          </div>
          <div className="w-48">
            <OrderStatusSelect
              orderId={order.id}
              currentStatus={order.status}
            />
          </div>
        </CardHeader>
        <div className="px-6 py-2">
          <Separator />
        </div>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Details</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">{order.user.name}</p>
                <p>{order.user.email}</p>
                <p>{order.phone || "No phone"}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {order.address || "No address provided"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <div className="px-6 py-2">
          <Separator />
        </div>
        <CardContent>
          <div className="flex flex-col gap-4">
            {order.orderItems.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0"
              >
                <div className="flex gap-4 items-center">
                  {item.product.images[0] && (
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        alt={item.product.name}
                        className="object-cover"
                        fill
                        src={item.product.images[0]}
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-sm text-muted-foreground">
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
        <div className="px-6 py-2">
          <Separator />
        </div>
        <CardFooter className="justify-end py-4">
          <div className="flex gap-8 items-center">
            <span className="text-muted-foreground">Total</span>
            <span className="text-xl font-bold">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
