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
    const totalCustomers = await prisma.user.count({
      where: {
        role: "USER",
      },
    });

    // 5. Sales Over Time (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await prisma.order.findMany({
      where: {
        status: { in: ["PAID", "DELIVERED", "SHIPPED"] },
        createdAt: { gte: thirtyDaysAgo },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    const salesMap = new Map<string, number>();
    const productSalesMap = new Map<string, { name: string; sales: number }>();

    // Initialize last 30 days with 0
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      salesMap.set(dateString, 0);
    }

    recentOrders.forEach((order) => {
      // Sales Over Time
      const dateString = order.createdAt.toISOString().split("T")[0];
      if (salesMap.has(dateString)) {
        salesMap.set(
          dateString,
          (salesMap.get(dateString) || 0) + Number(order.total)
        );
      }

      // Top Products
      order.orderItems.forEach((item) => {
        const productId = item.productId;
        const revenue = Number(item.price) * item.quantity;

        if (productSalesMap.has(productId)) {
          const current = productSalesMap.get(productId)!;
          productSalesMap.set(productId, {
            name: current.name,
            sales: current.sales + revenue,
          });
        } else {
          productSalesMap.set(productId, {
            name: item.product.name,
            sales: revenue,
          });
        }
      });
    });

    const salesOverTime = Array.from(salesMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      salesOverTime,
      topProducts,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      salesOverTime: [],
      topProducts: [],
      error: "Failed to fetch stats",
    };
  }
}
