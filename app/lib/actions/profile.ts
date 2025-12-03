"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { headers } from "next/headers";

export async function getUserProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        addresses: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function getUserOrders() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serialize Decimal to number
    return orders.map((order) => ({
      ...order,
      total: Number(order.total),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: Number(item.price),
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
      })),
    }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

export async function getUserOrder(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order || order.userId !== session.user.id) {
      return null;
    }

    return {
      ...order,
      total: Number(order.total),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: Number(item.price),
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching user order:", error);
    return null;
  }
}
