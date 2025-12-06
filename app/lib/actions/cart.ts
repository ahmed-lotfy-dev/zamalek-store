"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export type CartItemDTO = {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
};

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function getCart(): Promise<CartItemDTO[]> {
  const session = await getSession();
  if (!session) return [];

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cart) return [];

  return cart.items.map((item: any) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      name: item.product.name,
      price: Number(item.product.price),
      images: item.product.images,
      stock: item.product.stock,
    },
  }));
}

export async function addToCart(productId: string, quantity: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;

  // Ensure cart exists
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  // Check if item exists
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  return getCart();
}

export async function updateCartItemQuantity(
  productId: string,
  quantity: number
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (!cart) return [];

  // Find the item by cartId and productId
  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (item) {
    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });
  }

  return getCart();
}

export async function removeFromCart(productId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (!cart) return [];

  // Delete using the composite unique key if possible, or find and delete
  // Prisma delete requires unique where input. cartId_productId is unique.
  try {
    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
  } catch (e) {
    // Item might not exist, ignore
  }

  return getCart();
}

export async function clearCart() {
  const session = await getSession();
  if (!session) return; // Or throw error? Just return for safety.

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}

export async function mergeCart(
  localItems: { productId: string; quantity: number }[]
) {
  const session = await getSession();
  if (!session) return [];

  const userId = session.user.id;

  // Ensure cart exists
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  for (const localItem of localItems) {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: localItem.productId,
        },
      },
    });

    if (existingItem) {
      // If item exists, we can either sum them or take the max.
      // Usually summing is better for "I added this while logged out"
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + localItem.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: localItem.productId,
          quantity: localItem.quantity,
        },
      });
    }
  }

  return getCart();
}
