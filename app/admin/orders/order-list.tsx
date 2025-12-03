"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Button,
} from "@heroui/react";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";

const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "default" | "primary" | "secondary"
> = {
  [OrderStatus.PAID]: "success",
  [OrderStatus.DELIVERED]: "success",
  [OrderStatus.PENDING]: "warning",
  [OrderStatus.SHIPPED]: "primary",
  [OrderStatus.CANCELLED]: "danger",
};

export default function OrderList({ orders }: { orders: any[] }) {
  return (
    <Table aria-label="Orders table">
      <TableHeader>
        <TableColumn>ORDER ID</TableColumn>
        <TableColumn>CUSTOMER</TableColumn>
        <TableColumn>TOTAL</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>DATE</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No orders found."}>
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
              <Chip
                className="capitalize"
                color={statusColorMap[order.status]}
                size="sm"
                variant="flat"
              >
                {order.status.toLowerCase()}
              </Chip>
            </TableCell>
            <TableCell>
              {new Date(order.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="relative flex items-center gap-2">
                <Tooltip content="View Details">
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
