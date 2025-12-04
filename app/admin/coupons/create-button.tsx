"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

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
