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
  couponCode: z.string().optional(),
});

import { paymob } from "@/app/lib/paymob";

// ... existing imports

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
      items: formData.get("items")
        ? JSON.parse(formData.get("items") as string)
        : [],
      couponCode: formData.get("couponCode") || undefined,
    };

    const validatedData = checkoutSchema.safeParse(rawData);

    if (!validatedData.success) {
      console.error("Validation Error:", validatedData.error.flatten());
      return {
        error: "Invalid form data",
        details: validatedData.error.flatten(),
      };
    }

    const {
      items,
      paymentMethod,
      address,
      city,
      phone,
      couponCode,
      name,
      email,
    } = validatedData.data;

    // 3. Transaction: Check Stock -> Create Order -> Update Stock
    const order = await prisma.$transaction(async (tx: any) => {
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
      let total = items.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      );

      let discountAmount = 0;
      let couponId = null;

      // Validate and Apply Coupon
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode },
        });

        if (coupon) {
          if (!coupon.isActive) {
            throw new Error("Coupon is not active");
          }
          if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            throw new Error("Coupon has expired");
          }
          if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            throw new Error("Coupon usage limit reached");
          }

          if (coupon.type === "PERCENTAGE") {
            discountAmount = (total * Number(coupon.amount)) / 100;
          } else {
            discountAmount = Number(coupon.amount);
          }

          // Ensure discount doesn't exceed total
          if (discountAmount > total) {
            discountAmount = total;
          }

          total -= discountAmount;
          couponId = coupon.id;

          // Increment used count
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          status: "PENDING",
          total: total,
          isPaid: false,
          phone: phone,
          address: `${address}, ${city}`,
          couponId: couponId,
          discount: discountAmount,
          orderItems: {
            create: items.map((item: any) => ({
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

    // 4. Handle Paymob Payment
    if (paymentMethod === "paymob") {
      try {
        const token = await paymob.authenticate();
        const paymobOrder = await paymob.registerOrder(
          token,
          Number(order.total),
          "EGP",
          order.id
        );

        const billingData = {
          first_name: name.split(" ")[0],
          last_name: name.split(" ").slice(1).join(" ") || "User",
          email: email,
          phone_number: phone,
          apartment: "NA",
          floor: "NA",
          street: address,
          building: "NA",
          shipping_method: "NA",
          postal_code: "NA",
          city: city,
          country: "EG",
          state: "NA",
        };

        const paymentKey = await paymob.getPaymentKey(
          token,
          paymobOrder.id,
          billingData,
          Number(order.total)
        );

        const redirectUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

        return {
          success: true,
          url: redirectUrl,
        };
      } catch (error) {
        console.error("Paymob Integration Error:", error);
        // If payment initiation fails, we might want to cancel the order or let it stay pending
        // For now, we return an error but the order is created
        return {
          success: true, // Order created successfully
          orderId: order.id,
          warning:
            "Order created but payment initiation failed. Please try paying from your orders page.",
        };
      }
    }

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return { error: error.message || "Failed to create order" };
  }
}
