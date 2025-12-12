import { getUserOrders } from "@/app/lib/actions/profile";
import { Button, Card, CardContent, CardHeader, Chip } from "@heroui/react";

import { Link } from "@/i18n/routing";
import { Package, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getStatusColor } from "@/app/lib/utils";

export default async function OrderHistoryPage() {
  const orders = await getUserOrders();
  const t = await getTranslations("Profile");

  return (
    <Card>
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <h2 className="text-xl font-bold">{t("orderHistory")}</h2>
        <p className="text-small text-default-500">{t("orderHistoryDesc")}</p>
      </CardHeader>
      <CardContent className="overflow-visible py-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-default-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>{t("noOrders")}</p>
            <Button
              as={Link}
              href="/products"
              color="primary"
              variant="flat"
              className="mt-4"
            >
              {t("startShopping")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-divider rounded-lg hover:bg-default-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">#{order.id.slice(-6)}</span>
                    <Chip
                      size="sm"
                      color={getStatusColor(order.status)}
                      variant="flat"
                    >
                      {order.status}
                    </Chip>
                  </div>
                  <p className="text-sm text-default-500">
                    {new Date(order.createdAt).toLocaleDateString()} •{" "}
                    {order.orderItems.length} {t("items")}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                  <span className="font-bold text-lg">
                    ${order.total.toFixed(2)}
                  </span>
                  <Button
                    as={Link}
                    href={`/profile/orders/${order.id}`}
                    size="sm"
                    variant="light"
                    endContent={<ChevronRight className="w-4 h-4" />}
                  >
                    {t("viewDetails")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
