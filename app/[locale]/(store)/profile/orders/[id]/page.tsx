import { getUserOrder } from "@/app/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ArrowLeft, MapPin, Phone, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
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
        <Link href="/profile/orders">
          <Button size="icon" variant="outline" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Order #{order.id.slice(-6)}
            <Badge variant="secondary">
              {order.status}
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0 border">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-muted-foreground text-sm">{order.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p className="text-muted-foreground text-sm">{order.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-muted-foreground text-sm">Cash on Delivery</p>
                  <Badge
                    variant={order.isPaid ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {order.isPaid ? "Paid" : "Pending Payment"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
