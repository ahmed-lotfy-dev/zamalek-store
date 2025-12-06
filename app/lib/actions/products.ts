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

export async function getPaginatedProducts(
  page = 1,
  limit = 10,
  filters?: {
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
    hideOutOfStock?: boolean;
  }
) {
  try {
    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by Category
    if (filters?.categoryIds && filters.categoryIds.length > 0) {
      where.categoryId = { in: filters.categoryIds };
    }

    // Filter by Price
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    // Filter by Search
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { nameEn: { contains: filters.search, mode: "insensitive" } },
        { descriptionEn: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    // Filter by Stock
    if (filters?.hideOutOfStock) {
      where.stock = { gt: 0 };
    }

    // Sort
    let orderBy: any = { createdAt: "desc" };
    if (filters?.sort) {
      switch (filters.sort) {
        case "price_asc":
          orderBy = { price: "asc" };
          break;
        case "price_desc":
          orderBy = { price: "desc" };
          break;
        case "newest":
        default:
          orderBy = { createdAt: "desc" };
          break;
      }
    }

    const [products, totalCount] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      products,
      metadata: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    return {
      products: [],
      metadata: { totalCount: 0, totalPages: 0, currentPage: 1, limit },
    };
  }
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
      include: { category: true, variants: true },
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
          select: { name: true, nameEn: true },
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

export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string
) {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: currentProductId },
      },
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
    console.error("Error fetching related products:", error);
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
  const nameEn = formData.get("nameEn") as string;
  const description = formData.get("description") as string;
  const descriptionEn = formData.get("descriptionEn") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const variantsJson = formData.get("variants") as string;
  let variants: any[] = [];
  if (variantsJson) {
    try {
      variants = JSON.parse(variantsJson);
    } catch (e) {
      console.error("Error parsing variants:", e);
    }
  }

  const slug = nameEn
    ? nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    : name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

  await prisma.product.create({
    data: {
      name,
      nameEn,
      slug,
      description,
      descriptionEn,
      price,
      stock,
      categoryId,
      images: imageUrl ? [imageUrl] : [],
      variants: {
        create: variants.map((v) => ({
          color: v.color,
          size: v.size,
          stock: v.stock,
        })),
      },
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
  const nameEn = formData.get("nameEn") as string;
  const description = formData.get("description") as string;
  const descriptionEn = formData.get("descriptionEn") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const variantsJson = formData.get("variants") as string;
  let variants: any[] = [];
  if (variantsJson) {
    try {
      variants = JSON.parse(variantsJson);
    } catch (e) {
      console.error("Error parsing variants:", e);
    }
  }

  const slug = nameEn
    ? nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    : name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

  const data: any = {
    name,
    nameEn,
    slug,
    description,
    descriptionEn,
    price,
    stock,
    categoryId,
    variants: {
      deleteMany: {},
      create: variants.map((v) => ({
        color: v.color,
        size: v.size,
        stock: v.stock,
      })),
    },
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
