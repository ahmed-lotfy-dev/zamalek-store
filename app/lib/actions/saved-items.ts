"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleSavedItem(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const existingSavedItem = await prisma.savedItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingSavedItem) {
    await prisma.savedItem.delete({
      where: {
        id: existingSavedItem.id,
      },
    });
  } else {
    await prisma.savedItem.create({
      data: {
        userId,
        productId,
      },
    });
  }

  revalidatePath("/saved");
  revalidatePath(`/product/${productId}`);
  revalidatePath("/products");
  revalidatePath("/");
}

export async function getSavedItems() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return [];
    }

    const savedItems = await prisma.savedItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return savedItems;
  } catch (error) {
    console.error("Error getting saved items:", error);
    return [];
  }
}

export async function isProductSaved(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return false;
  }

  const savedItem = await prisma.savedItem.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });

  return !!savedItem;
}
