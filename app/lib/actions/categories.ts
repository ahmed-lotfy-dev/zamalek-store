"use server";

import { prisma } from "@/app/lib/prisma";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function createCategory(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;

  await prisma.category.create({
    data: { name },
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

  await prisma.category.update({
    where: { id },
    data: { name },
  });

  revalidatePath("/admin/categories");
}
