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
  paymentMethod: z.enum(["cod", "paymob", "stripe", "kashier"]),
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
import { kashier } from "@/app/lib/kashier";
import { stripe } from "@/app/lib/stripe";

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
          order.id,
          [] // Send empty items to match working reference
        );

        const billingData = {
          first_name: name.split(" ")[0] || "User",
          last_name: name.split(" ").slice(1).join(" ") || "User",
          email: email,
          phone_number: ((p) => {
            const clean = p.replace(/[^\d]/g, ""); // Remove non-digits
            if (clean.startsWith("0")) return `2${clean}`;
            if (clean.startsWith("20")) return clean;
            return `20${clean}`;
          })(phone),
          apartment: "1",
          floor: "1",
          street: "Cairo",
          building: "1",
          shipping_method: "PKG",
          postal_code: "11511",
          city: "Cairo",
          country: "EG",
          state: "Cairo",
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

    // 5. Handle Stripe Payment
    if (paymentMethod === "stripe") {
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: items.map((item: any) => ({
            price_data: {
              currency: "egp",
              product_data: {
                name: `Product ${item.id}`, // Ideally fetch product name
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
          })),
          mode: "payment",
          success_url: `${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${
            order.id
          }`,
          cancel_url: `${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/checkout?canceled=true`,
          metadata: {
            orderId: order.id,
            userId: session.user.id,
          },
        });

        if (!stripeSession.url) {
          throw new Error("Failed to create Stripe session URL");
        }

        return {
          success: true,
          url: stripeSession.url,
        };
      } catch (error) {
        console.error("Stripe Integration Error:", error);
        return {
          success: true,
          orderId: order.id,
          warning:
            "Order created but Stripe payment initiation failed. Please try paying from your orders page.",
        };
      }
    }

    // 6. Handle Kashier Payment
    if (paymentMethod === "kashier") {
      try {
        const kashierOrder = await kashier.createOrder({
          amount: Number(order.total),
          currency: "EGP",
          merchantOrderId: order.id,
          customerEmail: email,
          customerPhone: phone,
          customerName: name,
        });

        return {
          success: true,
          url: kashierOrder.payment_url,
        };
      } catch (error) {
        console.error("Kashier Integration Error:", error);
        return {
          success: true,
          orderId: order.id,
          warning:
            "Order created but Kashier payment initiation failed. Please try paying from your orders page.",
        };
      }
    }

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return { error: error.message || "Failed to create order" };
  }
}

export async function verifyStripePayment(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Update order status to PAID
      if (session.metadata?.orderId) {
        await prisma.order.update({
          where: { id: session.metadata.orderId },
          data: { isPaid: true, status: "PAID" },
        });
      }
      return { success: true };
    } else {
      return { success: false, error: "Payment not completed" };
    }
  } catch (error) {
    console.error("Stripe Verification Error:", error);
    return { success: false, error: "Failed to verify payment" };
  }
}
