"use server";

import { prisma } from "@/app/lib/prisma";

export async function getDashboardStats() {
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
      (acc, order) => acc + Number(order.total),
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
