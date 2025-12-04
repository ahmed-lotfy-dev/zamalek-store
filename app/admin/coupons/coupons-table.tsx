"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { DeleteCouponButton } from "./delete-button";

interface CouponsTableProps {
  coupons: any[];
}

export function CouponsTable({ coupons }: CouponsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardBody>
        <Table aria-label="Coupons table">
          <TableHeader>
            <TableColumn>CODE</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>VALUE</TableColumn>
            <TableColumn>USAGE</TableColumn>
            <TableColumn>SALES GENERATED</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>EXPIRES</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <span className="font-mono font-bold">{coupon.code}</span>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">
                    {coupon.type}
                  </Chip>
                </TableCell>
                <TableCell>
                  {coupon.type === "PERCENTAGE"
                    ? `${coupon.amount}%`
                    : formatCurrency(coupon.amount)}
                </TableCell>
                <TableCell>
                  {coupon.usedCount} / {coupon.maxUses ? coupon.maxUses : "∞"}
                </TableCell>
                <TableCell className="font-semibold text-success">
                  {formatCurrency(coupon.totalSales)}
                </TableCell>
                <TableCell>
                  <Chip
                    color={coupon.isActive ? "success" : "danger"}
                    size="sm"
                    variant="dot"
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </Chip>
                </TableCell>
                <TableCell>{formatDate(coupon.expiresAt)}</TableCell>
                <TableCell>
                  <DeleteCouponButton id={coupon.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
