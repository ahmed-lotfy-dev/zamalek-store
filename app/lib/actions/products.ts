"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function searchProducts(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
        category: {
          select: { name: true },
        },
      },
    });
    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

export async function getNewArrivals() {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function createProduct(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      stock,
      categoryId,
      images: imageUrl ? [imageUrl] : [],
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const data: any = {
    name,
    slug,
    description,
    price,
    stock,
    categoryId,
  };

  if (imageUrl) {
    data.images = [imageUrl];
  }

  await prisma.product.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}
