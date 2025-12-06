"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/lib/auth";

import { headers } from "next/headers";

export async function getUserAddresses() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return [];
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return addresses;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
}

export async function createAddress(data: {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { error: "You must be logged in to add an address" };
    }

    await prisma.address.create({
      data: {
        userId: session.user.id,
        ...data,
      },
    });

    revalidatePath("/profile/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Error creating address:", error);
    return { error: "Failed to add address" };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    await prisma.address.delete({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    revalidatePath("/profile/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Error deleting address:", error);
    return { error: "Failed to delete address" };
  }
}
