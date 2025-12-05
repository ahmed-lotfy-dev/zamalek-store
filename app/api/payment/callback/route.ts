import { prisma } from "@/app/lib/prisma";
import { paymob } from "@/app/lib/paymob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { searchParams } = new URL(req.url);
    const hmac = searchParams.get("hmac");

    if (!hmac) {
      return new NextResponse("Missing HMAC", { status: 400 });
    }

    // 1. Security Check: Verify HMAC
    const isValid = paymob.verifyHmac(data.obj, hmac);
    if (!isValid) {
      console.error("Invalid Paymob HMAC Signature");
      return new NextResponse("Invalid Signature", { status: 403 });
    }

    const transactionId = data.obj.id.toString();
    const merchantOrderId = data.obj.order.merchant_order_id;
    const success = data.obj.success;
    const amount = data.obj.amount_cents / 100;
    const currency = data.obj.currency;

    // 2. Idempotency Check
    const existingPayment = await prisma.payment.findUnique({
      where: { transactionId },
    });

    if (existingPayment) {
      return new NextResponse("Already Processed", { status: 200 });
    }

    // 3. Process Payment
    if (success) {
      await prisma.$transaction([
        prisma.payment.create({
          data: {
            orderId: merchantOrderId,
            transactionId: transactionId,
            amount: amount,
            currency: currency,
            status: "SUCCESS",
            provider: "PAYMOB",
          },
        }),
        prisma.order.update({
          where: { id: merchantOrderId },
          data: {
            status: "PAID",
            isPaid: true,
          },
        }),
      ]);
    } else {
      // Log failed payment attempt
      await prisma.payment.create({
        data: {
          orderId: merchantOrderId,
          transactionId: transactionId,
          amount: amount,
          currency: currency,
          status: "FAILED",
          provider: "PAYMOB",
        },
      });
    }

    return new NextResponse("Received", { status: 200 });
  } catch (error) {
    console.error("Paymob Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  // Paymob might redirect user here with GET params, but we rely on POST webhook for status update.
  // We can redirect user to success/error page based on query params.
  const { searchParams } = new URL(req.url);
  const success = searchParams.get("success") === "true";

  // Determine the base URL
  // If running behind a proxy, req.url might be localhost.
  // We try to use the Host header if available.
  const host = req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "https";

  const baseUrl = host ? `${protocol}://${host}` : new URL(req.url).origin;

  if (success) {
    return NextResponse.redirect(new URL("/checkout/success", baseUrl));
  } else {
    return NextResponse.redirect(new URL("/checkout/error", baseUrl));
  }
}
