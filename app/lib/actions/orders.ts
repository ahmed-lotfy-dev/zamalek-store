"use server";

import { prisma } from "@/app/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function getOrders(page = 1, limit = 10) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "ADMIN") {
    return {
      orders: [],
      metadata: { totalCount: 0, totalPages: 0, currentPage: 1, limit },
    };
  }

  try {
    const skip = (page - 1) * limit;

    const [orders, totalCount] = await prisma.$transaction([
      prisma.order.findMany({
        skip,
        take: limit,
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.order.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const formattedOrders = orders.map((order: any) => ({
      ...order,
      total: Number(order.total),
      discount: Number(order.discount),
      orderItems: order.orderItems.map((item: any) => ({
        ...item,
        price: Number(item.price),
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
      })),
    }));

    return {
      orders: formattedOrders,
      metadata: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      orders: [],
      metadata: { totalCount: 0, totalPages: 0, currentPage: 1, limit },
    };
  }
}

export async function getOrder(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "ADMIN") {
    return null;
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) return null;

    return {
      ...order,
      total: Number(order.total),
      discount: Number(order.discount),
      orderItems: order.orderItems.map((item: any) => ({
        ...item,
        price: Number(item.price),
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
