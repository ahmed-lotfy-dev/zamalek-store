import { getUserOrders } from "@/app/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Link } from "@/i18n/routing";
import { Package, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function OrderHistoryPage() {
  const orders = await getUserOrders();
  const t = await getTranslations("Profile");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("orderHistory")}</CardTitle>
        <CardDescription>{t("orderHistoryDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>{t("noOrders")}</p>
            <Link href="/products" className="mt-4 inline-block">
              <Button>
                {t("startShopping")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">#{order.id.slice(-6)}</span>
                    <Badge variant="outline">
                      {t(`status.${order.status.toLowerCase()}`)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} •{" "}
                    {order.orderItems.length} {t("items")}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                  <span className="font-bold text-lg">
                    ${order.total.toFixed(2)}
                  </span>
                  <Link href={`/profile/orders/${order.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      {t("viewDetails")}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
