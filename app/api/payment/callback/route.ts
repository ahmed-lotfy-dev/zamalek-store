import { prisma } from "@/app/lib/prisma";
import { paymob } from "@/app/lib/paymob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { searchParams } = new URL(req.url);
    const hmac = searchParams.get("hmac");

    console.log("📥 Paymob Webhook Received");

    if (!hmac) {
      console.error("❌ Missing HMAC in webhook request");
      return new NextResponse("Missing HMAC", { status: 400 });
    }

    // 1. Security Check: Verify HMAC
    const isValid = paymob.verifyHmac(data.obj, hmac);
    if (!isValid) {
      console.error("❌ Invalid Paymob HMAC Signature");
      return new NextResponse("Invalid Signature", { status: 403 });
    }

    console.log("✅ HMAC verified successfully");

    const transactionId = data.obj.id.toString();
    const merchantOrderId = data.obj.order.merchant_order_id;
    const success = data.obj.success;
    const amount = data.obj.amount_cents / 100;
    const currency = data.obj.currency;

    console.log(
      `📦 Processing transaction ${transactionId} for order ${merchantOrderId}`
    );
    console.log(`💰 Amount: ${amount} ${currency}, Success: ${success}`);

    // 2. Idempotency Check
    const existingPayment = await prisma.payment.findUnique({
      where: { transactionId },
    });

    if (existingPayment) {
      console.log(
        `⚠️  Transaction ${transactionId} already processed (idempotency check)`
      );
      return new NextResponse("Already Processed", { status: 200 });
    }

    // 3. Process Payment
    if (success) {
      console.log(
        `✅ Payment successful - updating order ${merchantOrderId} to PAID`
      );
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
      console.log(`✅ Order ${merchantOrderId} marked as PAID`);
    } else {
      // Extract error information from Paymob response
      const errorMessage =
        data.obj.data?.message || data.obj.data_message || "Unknown error";
      const errorCode = data.obj.data?.txn_response_code || "N/A";

      console.error("❌ Payment failed:");
      console.error(`   Transaction ID: ${transactionId}`);
      console.error(`   Order ID: ${merchantOrderId}`);
      console.error(`   Error Message: ${errorMessage}`);
      console.error(`   Error Code: ${errorCode}`);
      console.error(`   Amount: ${amount} ${currency}`);

      // Log the entire data object for debugging
      if (data.obj.data) {
        console.error(
          `   Full Error Data:`,
          JSON.stringify(data.obj.data, null, 2)
        );
      }

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

      console.log(`📝 Failed payment logged for order ${merchantOrderId}`);
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
    // Forward error details to the error page
    const errorUrl = new URL("/checkout/error", baseUrl);
    const message = searchParams.get("data.message");
    const responseCode = searchParams.get("txn_response_code");

    if (message) errorUrl.searchParams.set("message", message);
    if (responseCode) errorUrl.searchParams.set("code", responseCode);

    return NextResponse.redirect(errorUrl);
  }
}
