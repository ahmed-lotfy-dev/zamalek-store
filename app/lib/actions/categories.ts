"use server";

import { prisma } from "@/app/lib/prisma";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getCategoriesWithImages() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      products: {
        take: 1,
        select: { images: true },
      },
    },
  });
}

export async function getPaginatedCategories(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;

    const [categories, totalCount] = await prisma.$transaction([
      prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.category.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      categories,
      metadata: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching paginated categories:", error);
    return {
      categories: [],
      metadata: { totalCount: 0, totalPages: 0, currentPage: 1, limit },
    };
  }
}

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function createCategory(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const image = formData.get("image") as string;

  await prisma.category.create({
    data: { name, image },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const image = formData.get("image") as string;

  await prisma.category.update({
    where: { id },
    data: { name, image },
  });

  revalidatePath("/admin/categories");
}
