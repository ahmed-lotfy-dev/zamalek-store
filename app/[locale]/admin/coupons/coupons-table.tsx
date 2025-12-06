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
import { useTranslations } from "next-intl";
import { useFormat } from "@/app/hooks/use-format";

interface CouponsTableProps {
  coupons: any[];
}

export function CouponsTable({ coupons }: CouponsTableProps) {
  const t = useTranslations("Coupons");
  const { formatCurrency, formatDate } = useFormat();

  return (
    <Card>
      <CardBody>
        <Table aria-label="Coupons table">
          <TableHeader>
            <TableColumn>{t("code").toUpperCase()}</TableColumn>
            <TableColumn>{t("type").toUpperCase()}</TableColumn>
            <TableColumn>{t("discount").toUpperCase()}</TableColumn>
            <TableColumn>{t("usage").toUpperCase()}</TableColumn>
            <TableColumn>{t("salesGenerated").toUpperCase()}</TableColumn>
            <TableColumn>{t("status").toUpperCase()}</TableColumn>
            <TableColumn>{t("expiresAt").toUpperCase()}</TableColumn>
            <TableColumn>{t("actions").toUpperCase()}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={t("noCoupons")}>
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
                    {coupon.isActive ? t("active") : t("expired")}
                  </Chip>
                </TableCell>
                <TableCell>
                  {coupon.expiresAt ? formatDate(coupon.expiresAt) : "Never"}
                </TableCell>
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
