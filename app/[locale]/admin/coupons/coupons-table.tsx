"use client";

import { DeleteCouponButton } from "./delete-button";
import { useTranslations } from "next-intl";
import { useFormat } from "@/app/hooks/use-format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CouponsTableProps {
  coupons: any[];
}

export function CouponsTable({ coupons }: CouponsTableProps) {
  const t = useTranslations("Coupons");
  const { formatCurrency, formatDate } = useFormat();

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("code")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("discount")}</TableHead>
              <TableHead>{t("usage")}</TableHead>
              <TableHead>{t("salesGenerated")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("expiresAt")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  {t("noCoupons")}
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-bold">
                    {coupon.code}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {coupon.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {coupon.type === "PERCENTAGE"
                      ? `${coupon.amount}%`
                      : formatCurrency(coupon.amount)}
                  </TableCell>
                  <TableCell>
                    {coupon.usedCount} / {coupon.maxUses ? coupon.maxUses : "∞"}
                  </TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {formatCurrency(coupon.totalSales)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={coupon.isActive ? "default" : "destructive"}
                    >
                      {coupon.isActive ? t("active") : t("expired")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {coupon.expiresAt ? formatDate(coupon.expiresAt) : "Never"}
                  </TableCell>
                  <TableCell>
                    <DeleteCouponButton id={coupon.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
