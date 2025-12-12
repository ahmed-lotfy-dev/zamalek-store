"use client";

import { EyeIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react";

import { getStatusColor } from "@/app/lib/utils";
import OrderStatusSelect from "./order-status-select";

export default function OrderList({ orders }: { orders: any[] }) {
  const t = useTranslations("Admin");

  return (
    <Table aria-label="Orders table">
      <TableHeader>
        <TableColumn>{t("orderId")}</TableColumn>
        <TableColumn>{t("customer")}</TableColumn>
        <TableColumn>{t("total")}</TableColumn>
        <TableColumn>{t("status")}</TableColumn>
        <TableColumn>{t("date")}</TableColumn>
        <TableColumn>{t("actions")}</TableColumn>
      </TableHeader>
      <TableBody emptyContent={t("noOrders")}>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id.slice(0, 8)}...</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-bold text-sm">{order.user.name}</span>
                <span className="text-tiny text-default-400">
                  {order.user.email}
                </span>
              </div>
            </TableCell>
            <TableCell>${Number(order.total).toFixed(2)}</TableCell>
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
              <div className="relative flex items-center gap-2">
                <Tooltip content={t("viewDetails")}>
                  <Button
                    as={Link}
                    href={`/admin/orders/${order.id}`}
                    isIconOnly
                    size="sm"
                    variant="light"
                  >
                    <EyeIcon size={20} className="text-default-400" />
                  </Button>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
