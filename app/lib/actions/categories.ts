"use server";

import { prisma } from "@/app/lib/prisma";

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}
