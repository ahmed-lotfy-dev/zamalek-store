"use client";

import { EyeIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getStatusColor } from "@/app/lib/utils";
import OrderStatusSelect from "./order-status-select";

export default function OrderList({ orders }: { orders: any[] }) {
  const t = useTranslations("Admin");

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 text-muted-foreground">
        {t("noOrders")}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("orderId")}</TableHead>
            <TableHead>{t("customer")}</TableHead>
            <TableHead>{t("total")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {order.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{order.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {order.user.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                ${Number(order.total).toFixed(2)}
              </TableCell>
              <TableCell>
                <OrderStatusSelect
                  orderId={order.id}
                  currentStatus={order.status}
                />
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button
                            size="icon"
                            variant="ghost"
                          >
                            <EyeIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("viewDetails")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
