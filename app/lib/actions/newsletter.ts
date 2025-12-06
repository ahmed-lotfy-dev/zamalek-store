"use server";

import { prisma } from "@/app/lib/prisma";
import { z } from "zod";

const subscriptionSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email");

  const result = subscriptionSchema.safeParse({ email });

  if (!result.success) {
    return {
      success: false,
      message: "invalidEmail",
    };
  }

  try {
    await prisma.subscription.upsert({
      where: { email: result.data.email },
      update: { isActive: true },
      create: { email: result.data.email },
    });

    return {
      success: true,
      message: "successMessage",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "errorMessage",
    };
  }
}
