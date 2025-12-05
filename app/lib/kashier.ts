import crypto from "crypto";

// TypeScript interfaces for Kashier API
interface KashierOrderResponse {
  payment_url: string;
  transaction_id: string;
  status: string;
  order_id: string;
}

// Validate environment variables on module load
function validateKashierEnv(): void {
  const required = ["KASHIER_API_KEY", "KASHIER_MERCHANT_ID"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing Kashier environment variables: ${missing.join(", ")}\n` +
        `   Kashier integration will not work until these are configured.\n` +
        `   See docs/KASHIER_INTEGRATION.md for setup instructions.`
    );
  }
}

// Run validation when module loads
validateKashierEnv();

export const kashier = {
  /**
   * Generate hash for Kashier payment
   * Formula: HMAC_SHA256("/?payment=MID.orderId.amount.currency", apiKey)
   */
  generateHash: (params: {
    merchantId: string;
    orderId: string;
    amount: string;
    currency: string;
    customerReference?: string;
  }): string => {
    const { merchantId, orderId, amount, currency, customerReference } = params;

    // Build path according to Kashier spec
    const path = customerReference
      ? `/?payment=${merchantId}.${orderId}.${amount}.${currency}.${customerReference}`
      : `/?payment=${merchantId}.${orderId}.${amount}.${currency}`;

    const apiKey = process.env.KASHIER_API_KEY || "";

    // Generate HMAC SHA256
    const hash = crypto.createHmac("sha256", apiKey).update(path).digest("hex");

    console.log("📝 Kashier Hash Generation:");
    console.log("   Path:", path);
    console.log("   Hash:", hash);

    return hash;
  },

  /**
   * Create a payment URL for Kashier Hosted Payment Page
   */
  createOrder: async (params: {
    amount: number;
    currency: string;
    merchantOrderId: string;
    customerEmail: string;
    customerPhone: string;
    customerName?: string;
  }): Promise<KashierOrderResponse> => {
    if (!process.env.KASHIER_MERCHANT_ID || !process.env.KASHIER_API_KEY) {
      throw new Error(
        "Kashier credentials not configured. Please set KASHIER_MERCHANT_ID and KASHIER_API_KEY in your .env file."
      );
    }

    try {
      const merchantId = process.env.KASHIER_MERCHANT_ID;
      const mode = process.env.KASHIER_MODE || "test";
      const amount = params.amount.toFixed(2);
      const currency = params.currency;
      const orderId = params.merchantOrderId;

      // Generate hash
      const hash = kashier.generateHash({
        merchantId,
        orderId,
        amount,
        currency,
      });

      // Build URLs
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const merchantRedirect = encodeURIComponent(
        `${baseUrl}/checkout/success`
      );
      const failureRedirect = encodeURIComponent(`${baseUrl}/checkout/error`);
      const serverWebhook = encodeURIComponent(
        `${baseUrl}/api/kashier/callback`
      );

      // Build Kashier Hosted Payment Page URL
      const paymentUrl =
        `https://payments.kashier.io/?` +
        `merchantId=${merchantId}&` +
        `orderId=${orderId}&` +
        `amount=${amount}&` +
        `currency=${currency}&` +
        `hash=${hash}&` +
        `mode=${mode}&` +
        `merchantRedirect=${merchantRedirect}&` +
        `failureRedirect=${failureRedirect}&` +
        `serverWebhook=${serverWebhook}&` +
        `display=en&` +
        `allowedMethods=card`;

      console.log("✅ Kashier payment URL generated successfully");
      console.log("   Order ID:", orderId);
      console.log("   Amount:", amount, currency);
      console.log("   Mode:", mode);

      return {
        payment_url: paymentUrl,
        transaction_id: orderId,
        status: "pending",
        order_id: orderId,
      };
    } catch (error) {
      console.error("❌ Kashier URL Generation Error:", error);
      throw error;
    }
  },

  /**
   * Verify Kashier callback signature
   * Kashier concatenates values of specific keys in order, then hashes with API key
   */
  verifyCallback: (query: Record<string, string>): boolean => {
    if (!process.env.KASHIER_API_KEY) {
      console.error("KASHIER_API_KEY is not set");
      return false;
    }

    try {
      const receivedSignature = query.signature;
      if (!receivedSignature) {
        console.error("❌ No signature in callback");
        return false;
      }

      // Remove signature from query to get the data fields
      const dataFields = { ...query };
      delete dataFields.signature;

      // Sort keys alphabetically and concatenate values
      const sortedKeys = Object.keys(dataFields).sort();
      const concatenatedValues = sortedKeys
        .map((key) => dataFields[key])
        .join("");

      console.log("Kashier Debug - Sorted Keys:", sortedKeys);
      console.log("Kashier Debug - Concatenated Values:", concatenatedValues);

      // Calculate signature using HMAC SHA256
      const calculatedSignature = crypto
        .createHmac("sha256", process.env.KASHIER_API_KEY)
        .update(concatenatedValues)
        .digest("hex");

      console.log("Kashier Debug - Received Signature:", receivedSignature);
      console.log("Kashier Debug - Calculated Signature:", calculatedSignature);

      return calculatedSignature === receivedSignature;
    } catch (error) {
      console.error("❌ Kashier signature verification error:", error);
      return false;
    }
  },
};
