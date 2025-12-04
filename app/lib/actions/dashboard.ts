"use server";

import { prisma } from "@/app/lib/prisma";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function getDashboardStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "ADMIN") {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      error: "Unauthorized",
    };
  }

  try {
    // 1. Total Revenue (from PAID or DELIVERED orders)
    const paidOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ["PAID", "DELIVERED", "SHIPPED"],
        },
      },
      select: {
        total: true,
      },
    });

    const totalRevenue = paidOrders.reduce(
      (acc: number, order: any) => acc + Number(order.total),
      0
    );

    // 2. Total Orders
    const totalOrders = await prisma.order.count();

    // 3. Total Products
    const totalProducts = await prisma.product.count();

    // 4. Total Customers
    // 4. Total Customers (exclude admins)
    const totalCustomers = await prisma.user.count({
      where: {
        role: "USER",
      },
    });

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
    };
  }
}
