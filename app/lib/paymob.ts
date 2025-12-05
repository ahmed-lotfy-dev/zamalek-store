import crypto from "crypto";

const PAYMOB_API_URL = "https://accept.paymob.com/api";

export const paymob = {
  authenticate: async () => {
    try {
      const response = await fetch(`${PAYMOB_API_URL}/auth/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.PAYMOB_API_KEY,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Authentication failed");
      return data.token;
    } catch (error) {
      console.error("Paymob Authentication Error:", error);
      throw error;
    }
  },

  registerOrder: async (
    token: string,
    amount: number,
    currency: string,
    merchantOrderId: string,
    items: any[] = []
  ) => {
    try {
      // Paymob expects amount in cents
      const amountCents = Math.round(amount * 100);

      const response = await fetch(`${PAYMOB_API_URL}/ecommerce/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: token,
          delivery_needed: "false",
          amount_cents: amountCents,
          currency: currency,
          merchant_order_id: merchantOrderId,
          items: items.map((item) => ({
            name: item.name,
            amount_cents: Math.round(item.price * 100),
            description: item.description || "Product",
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Order registration failed");
      return data;
    } catch (error) {
      console.error("Paymob Order Registration Error:", error);
      throw error;
    }
  },

  getPaymentKey: async (
    token: string,
    orderId: string,
    billingData: any,
    amount: number,
    currency: string = "EGP"
  ) => {
    try {
      const amountCents = Math.round(amount * 100);

      const payload = {
        auth_token: token,
        amount_cents: amountCents,
        expiration: 3600, // 1 hour
        order_id: orderId,
        billing_data: billingData,
        currency: currency,
        integration_id: Number(process.env.PAYMOB_INTEGRATION_ID),
      };

      const response = await fetch(
        `${PAYMOB_API_URL}/acceptance/payment_keys`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Payment key request failed");
      return data.token;
    } catch (error) {
      console.error("Paymob Payment Key Error:", error);
      throw error;
    }
  },

  verifyHmac: (data: any, hmac: string) => {
    if (!process.env.PAYMOB_HMAC_SECRET) {
      console.error("PAYMOB_HMAC_SECRET is not set");
      return false;
    }

    const keys = [
      "amount_cents",
      "created_at",
      "currency",
      "error_occured",
      "has_parent_transaction",
      "id",
      "integration_id",
      "is_3d_secure",
      "is_auth",
      "is_capture",
      "is_refunded",
      "is_standalone_payment",
      "is_voided",
      "order",
      "owner",
      "pending",
      "source_data.pan",
      "source_data.sub_type",
      "source_data.type",
      "success",
    ];

    const concatenatedString = keys
      .map((key) => {
        let value = key
          .split(".")
          .reduce((obj, k) => (obj ? obj[k] : undefined), data);

        // Special handling for 'order' which can be an object
        if (key === "order" && typeof value === "object" && value !== null) {
          value = value.id;
        }

        return value !== undefined ? value.toString() : "";
      })
      .join("");

    const calculatedHmac = crypto
      .createHmac("sha512", process.env.PAYMOB_HMAC_SECRET)
      .update(concatenatedString)
      .digest("hex");

    console.log("Paymob Debug - Received HMAC:", hmac);
    console.log("Paymob Debug - Calculated HMAC:", calculatedHmac);
    console.log("Paymob Debug - Concatenated String:", concatenatedString);
    console.log("Paymob Debug - Data Object:", JSON.stringify(data, null, 2));

    return calculatedHmac === hmac;
  },
};
