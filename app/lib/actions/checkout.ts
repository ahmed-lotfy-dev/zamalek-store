"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  paymentMethod: z.enum(["cod", "paymob"]),
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().min(1),
      price: z.number(),
    })
  ),
});

export async function createOrder(prevState: any, formData: FormData) {
  try {
    // 1. Get User Session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "You must be logged in to place an order" };
    }

    // 2. Parse & Validate Data
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      paymentMethod: formData.get("paymentMethod"),
      items: JSON.parse(formData.get("items") as string),
    };

    const validatedData = checkoutSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: "Invalid form data",
        details: validatedData.error.flatten(),
      };
    }

    const { items, paymentMethod, address, city, phone } = validatedData.data;

    // 3. Transaction: Check Stock -> Create Order -> Update Stock
    const order = await prisma.$transaction(async (tx) => {
      // Check stock for all items
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.id}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
      }

      // Calculate total
      const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          status: "PENDING",
          total: total,
          isPaid: false, // COD is unpaid initially
          phone: phone,
          address: `${address}, ${city}`,
          orderItems: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      // Update Stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return { error: error.message || "Failed to create order" };
  }
}
