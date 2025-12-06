"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/lib/auth";

import { headers } from "next/headers";

export async function createReview(
  productId: string,
  rating: number,
  comment: string
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { error: "You must be logged in to submit a review" };
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    if (existingReview) {
      return { error: "You have already reviewed this product" };
    }

    await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: productId,
        rating: rating,
        comment: comment,
      },
    });

    revalidatePath(`/products/[slug]`);
    return { success: true };
  } catch (error) {
    console.error("Error creating review:", error);
    return { error: "Failed to submit review" };
  }
}

export async function getProductReviews(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: productId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function getProductRatingSummary(productId: string) {
  try {
    const aggregations = await prisma.review.aggregate({
      where: {
        productId: productId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      averageRating: aggregations._avg.rating || 0,
      totalReviews: aggregations._count.rating || 0,
    };
  } catch (error) {
    console.error("Error fetching rating summary:", error);
    return { averageRating: 0, totalReviews: 0 };
  }
}
