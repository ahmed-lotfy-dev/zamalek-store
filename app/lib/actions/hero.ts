"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { deleteImageFromR2 } from "./upload";

export async function getHeroSlides() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return slides;
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return [];
  }
}

export async function getAllHeroSlides() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "ADMIN") {
    return [];
  }

  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    });
    return slides;
  } catch (error) {
    console.error("Error fetching all hero slides:", error);
    return [];
  }
}

export async function createHeroSlide(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const titleEn = formData.get("titleEn") as string;
  const description = formData.get("description") as string;
  const descriptionEn = formData.get("descriptionEn") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const link = formData.get("link") as string;
  const isActive = formData.get("isActive") === "true";
  
  // Auto-increment order
  const lastSlide = await prisma.heroSlide.findFirst({
    orderBy: { order: "desc" },
  });
  const order = lastSlide ? lastSlide.order + 1 : 0;

  await prisma.heroSlide.create({
    data: {
      title,
      titleEn,
      description,
      descriptionEn,
      imageUrl,
      link,
      isActive,
      order,
    },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/");
  redirect("/admin/hero");
}

export async function updateHeroSlide(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const titleEn = formData.get("titleEn") as string;
  const description = formData.get("description") as string;
  const descriptionEn = formData.get("descriptionEn") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const link = formData.get("link") as string;
  const isActive = formData.get("isActive") === "true";

  await prisma.heroSlide.update({
    where: { id },
    data: {
      title,
      titleEn,
      description,
      descriptionEn,
      imageUrl,
      link,
      isActive,
    },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/");
  redirect("/admin/hero");
}

export async function deleteHeroSlide(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (slide?.imageUrl) {
     await deleteImageFromR2(slide.imageUrl);
  }

  await prisma.heroSlide.delete({ where: { id } });
  
  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function toggleHeroSlideStatus(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) throw new Error("Slide not found");

  await prisma.heroSlide.update({
    where: { id },
    data: { isActive: !slide.isActive },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function reorderHeroSlides(items: { id: string; order: number }[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Execute in transaction to ensure consistency
  await prisma.$transaction(
    items.map((item) =>
      prisma.heroSlide.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  );

  revalidatePath("/admin/hero");
  revalidatePath("/");
}
