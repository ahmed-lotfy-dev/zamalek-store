"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@heroui/react";

export function CreateCouponButton() {
  return (
    <Button
      as={Link}
      href="/admin/coupons/new"
      color="primary"
      startContent={<Plus size={18} />}
    >
      Create Coupon
    </Button>
  );
}
