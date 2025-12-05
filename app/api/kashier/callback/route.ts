import { prisma } from "@/app/lib/prisma";
import { kashier } from "@/app/lib/kashier";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Kashier sends data as URL-encoded or in the URL params, not as FormData
    const { searchParams } = new URL(req.url);
    let data: Record<string, any> = {};

    // Convert URL search params to object
    searchParams.forEach((value, key) => {
      data[key] = value;
    });

    console.log("📥 Kashier Webhook Received");
    console.log("Kashier Callback Data:", JSON.stringify(data, null, 2));

    // If no data in URL params, try parsing body as JSON
    if (Object.keys(data).length === 0) {
      try {
        const bodyData = await req.json();
        data = bodyData;
        console.log("Parsed from JSON body:", JSON.stringify(data, null, 2));
      } catch (e) {
        console.log("No JSON body, using URL params only");
      }
    }

    // Kashier sends data in nested structure: { event: "pay", data: {...}, hash: "..." }
    const webhookData = data.data || data;
    const signature = data.hash || data.signature;

    if (!signature) {
      console.error("❌ No signature in callback");
      return new NextResponse("No Signature", { status: 403 });
    }

    // Build signature verification object from the signatureKeys
    const signatureKeys = webhookData.signatureKeys || [
      "amount",
      "channel",
      "creationDate",
      "currency",
      "kashierOrderId",
      "merchantOrderId",
      "method",
      "orderReference",
      "status",
      "transactionId",
      "transactionResponseCode",
    ];

    // Create verification data object with only the signature keys
    const verificationData: Record<string, string> = {};
    signatureKeys.forEach((key: string) => {
      if (webhookData[key] !== undefined) {
        verificationData[key] = String(webhookData[key]);
      }
    });
    verificationData.signature = signature;

    console.log(
      "Verification data:",
      JSON.stringify(verificationData, null, 2)
    );

    // Verify signature
    const isValid = kashier.verifyCallback(verificationData);
    if (!isValid) {
      console.error("❌ Invalid Kashier callback signature");
      return new NextResponse("Invalid Signature", { status: 403 });
    }

    console.log("✅ Kashier signature verified successfully");

    const merchantOrderId = webhookData.merchantOrderId;
    const transactionId = webhookData.transactionId;
    const amount = parseFloat(webhookData.amount || "0");
    const currency = webhookData.currency || "EGP";
    const paymentStatus = webhookData.status;

    console.log(
      `📦 Processing transaction ${transactionId} for order ${merchantOrderId}`
    );
    console.log(`💰 Amount: ${amount} ${currency}, Status: ${paymentStatus}`);

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
    const isSuccess = paymentStatus?.toLowerCase() === "success";

    if (isSuccess) {
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
            provider: "KASHIER",
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
      console.error("❌ Payment failed:");
      console.error(`   Transaction ID: ${transactionId}`);
      console.error(`   Order ID: ${merchantOrderId}`);
      console.error(`   Status: ${paymentStatus}`);
      console.error(`   Amount: ${amount} ${currency}`);

      // Log failed payment attempt
      await prisma.payment.create({
        data: {
          orderId: merchantOrderId,
          transactionId: transactionId,
          amount: amount,
          currency: currency,
          status: "FAILED",
          provider: "KASHIER",
        },
      });

      console.log(`📝 Failed payment logged for order ${merchantOrderId}`);
    }

    return new NextResponse("Received", { status: 200 });
  } catch (error) {
    console.error("Kashier Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  // Kashier redirects user here with GET params
  const { searchParams } = new URL(req.url);
  const paymentStatus = searchParams.get("paymentStatus");

  const host = req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const baseUrl = host ? `${protocol}://${host}` : new URL(req.url).origin;

  if (paymentStatus === "SUCCESS") {
    return NextResponse.redirect(new URL("/checkout/success", baseUrl));
  } else {
    return NextResponse.redirect(new URL("/checkout/error", baseUrl));
  }
}
