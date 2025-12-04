"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function validateCoupon(code: string, cartTotal: number) {
  try {
    const normalizedCode = code.toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      return { error: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      return { error: "This coupon is no longer active" };
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return { error: "This coupon has expired" };
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { error: "This coupon has reached its usage limit" };
    }

    let discountAmount = 0;

    if (coupon.type === "PERCENTAGE") {
      discountAmount = (cartTotal * Number(coupon.amount)) / 100;
    } else {
      discountAmount = Number(coupon.amount);
    }

    // Ensure discount doesn't exceed total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    return {
      success: true,
      discount: discountAmount,
      couponCode: coupon.code,
      type: coupon.type,
      value: Number(coupon.amount),
    };
  } catch (error) {
    console.error("Coupon Validation Error:", error);
    return { error: "Failed to validate coupon" };
  }
}

export async function getCoupons() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { orders: true },
        },
        orders: {
          select: {
            total: true, // We will sum this up manually or use aggregate if needed, but for "sales generated" we need the order total
            discount: true,
          },
        },
      },
    });

    const couponsWithMetrics = coupons.map((coupon) => {
      const totalSales = coupon.orders.reduce(
        (acc, order) => acc + Number(order.total) + Number(order.discount),
        0
      );

      // Destructure to exclude orders and _count from the result
      const { orders, _count, ...couponData } = coupon;

      return {
        ...couponData,
        amount: Number(coupon.amount),
        totalSales,
      };
    });

    return { success: true, coupons: couponsWithMetrics };
  } catch (error) {
    console.error("Get Coupons Error:", error);
    return { error: "Failed to fetch coupons" };
  }
}

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function createCoupon(data: {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  amount: number;
  maxUses?: number;
  expiresAt?: Date;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const code = data.code.toUpperCase();

    if (data.maxUses !== undefined && data.maxUses < 0) {
      return { error: "Max uses cannot be negative" };
    }

    if (data.type === "PERCENTAGE" && data.amount > 20) {
      return { error: "Percentage discount cannot exceed 20%" };
    }

    const existing = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existing) {
      return { error: "Coupon code already exists" };
    }

    await prisma.coupon.create({
      data: {
        code,
        type: data.type,
        amount: data.amount,
        maxUses: data.maxUses,
        expiresAt: data.expiresAt,
      },
    });

    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    console.error("Create Coupon Error:", error);
    return { error: "Failed to create coupon" };
  }
}

export async function deleteCoupon(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.coupon.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Delete Coupon Error:", error);
    return { error: "Failed to delete coupon" };
  }
}
