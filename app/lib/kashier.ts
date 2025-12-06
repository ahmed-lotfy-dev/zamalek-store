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
   * Kashier concatenates values in the order specified by signatureKeys array
   * Uses KASHIER_SECRET_KEY for webhook verification (not KASHIER_API_KEY)
   */
  verifyCallback: (
    query: Record<string, string>,
    signatureKeys?: string[],
    queryString?: string
  ): boolean => {
    try {
      const receivedSignature = query.signature;
      if (!receivedSignature) {
        console.error("❌ No signature in callback");
        return false;
      }

      // Helper to calculate HMAC
      const calcHmac = (secret: string, data: string) =>
        crypto.createHmac("sha256", secret).update(data).digest("hex");

      // Strategy 1: Use raw query string if provided (Best for Redirects)
      if (queryString) {
        // Remove signature and mode from query string if present
        // The query string usually comes as "key=val&key2=val2..."
        // We need to reconstruct it exactly as Kashier expects:
        // 1. Parse it to preserve order? No, we want the raw string but filtered.
        // Actually, if we have the raw query string, we should just use it?
        // But we need to remove 'signature' and 'mode'.

        // Better approach: If queryString is provided, we assume the caller wants us to use the order from it.
        // But we can't easily "remove" params from a string without parsing.
        // So we parse it into an array of keys to preserve order.
        const searchParams = new URLSearchParams(queryString);
        const keysInOrder: string[] = [];
        searchParams.forEach((_, key) => {
          if (key !== "signature" && key !== "mode") {
            keysInOrder.push(key);
          }
        });

        // Reconstruct query string using the values from the 'query' object (which might be decoded)
        // OR use the values from searchParams (which are raw/encoded).
        // My tests showed "URL Order (Raw)" worked.
        // URLSearchParams.forEach gives decoded values? No, it gives decoded.
        // But we want to construct "key=value".

        let rawQs = "";
        keysInOrder.forEach((key) => {
          // We use the value from the query object to ensure consistency,
          // but we MUST ensure it's not double encoded or something.
          // Actually, my test used `data[k]` which was the raw string from the log.
          // If `query` object has decoded values, we might need to be careful.
          // Let's rely on the fact that `query` passed from Next.js is usually decoded.
          // But my test passed with "Raw" strategy which constructed "&key=val".

          const val = query[key];
          if (val !== undefined) {
            rawQs += `&${key}=${val}`;
          }
        });
        rawQs = rawQs.substring(1);

        console.log("Kashier Verify (URL Order):", rawQs);

        if (process.env.KASHIER_API_KEY) {
          const sig = calcHmac(process.env.KASHIER_API_KEY, rawQs);
          if (sig === receivedSignature) return true;
        }
      }

      // Strategy 2: Use signatureKeys (Best for Webhooks)
      if (signatureKeys) {
        let rawQs = "";
        signatureKeys.forEach((key) => {
          const val = query[key];
          if (val !== undefined) {
            rawQs += `&${key}=${val}`;
          }
        });
        rawQs = rawQs.substring(1);

        console.log("Kashier Verify (SignatureKeys):", rawQs);

        // Webhooks might use Secret Key OR API Key. My test showed API Key worked for Redirect.
        // Let's try both for safety.
        if (process.env.KASHIER_API_KEY) {
          const sig = calcHmac(process.env.KASHIER_API_KEY, rawQs);
          if (sig === receivedSignature) return true;
        }
        if (process.env.KASHIER_SECRET_KEY) {
          const sig = calcHmac(process.env.KASHIER_SECRET_KEY, rawQs);
          if (sig === receivedSignature) return true;
        }
      }

      // Strategy 3: Alphabetical fallback (Old behavior)
      const sortedKeys = Object.keys(query)
        .filter((k) => k !== "signature" && k !== "mode")
        .sort();
      let rawQs = "";
      sortedKeys.forEach((key) => {
        const val = query[key];
        rawQs += `&${key}=${val}`;
      });
      rawQs = rawQs.substring(1);

      console.log("Kashier Verify (Alphabetical):", rawQs);

      if (process.env.KASHIER_API_KEY) {
        const sig = calcHmac(process.env.KASHIER_API_KEY, rawQs);
        if (sig === receivedSignature) return true;
      }

      console.error("❌ Signature verification failed");
      return false;
    } catch (error) {
      console.error("❌ Kashier signature verification error:", error);
      return false;
    }
  },
};
