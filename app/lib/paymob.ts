import { createHmac } from "crypto";

const PAYMOB_API_URL = "https://accept.paymob.com/api";

// TypeScript interfaces for Paymob API responses
interface PaymobAuthResponse {
  token: string;
  profile?: any;
  detail?: string; // Error detail when response is not ok
}

interface PaymobOrderResponse {
  id: string;
  created_at: string;
  delivery_needed: boolean;
  merchant: any;
  collector: any;
  amount_cents: number;
  shipping_data: any;
  currency: string;
  is_payment_locked: boolean;
  merchant_order_id: string;
  items: any[];
  detail?: string; // Error detail when response is not ok
}

interface PaymobPaymentKeyResponse {
  token: string;
  detail?: string; // Error detail when response is not ok
}

interface PaymobBillingData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  apartment: string;
  floor: string;
  street: string;
  building: string;
  shipping_method: string;
  postal_code: string;
  city: string;
  country: string;
  state: string;
}

// Validate environment variables on module load
function validatePaymobEnv(): void {
  const required = [
    "PAYMOB_API_KEY",
    "PAYMOB_INTEGRATION_ID",
    "PAYMOB_WALLET_INTEGRATION_ID",
    "PAYMOB_IFRAME_ID", // fallback
    "PAYMOB_CARD_IFRAME_ID",
    "PAYMOB_HMAC_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing Paymob environment variables: ${missing.join(", ")}\n` +
        `   Paymob integration will not work until these are configured.\n` +
        `   See .env.example for required variables.`
    );
  }
}

// Run validation when module loads
validatePaymobEnv();

export const paymob = {
  authenticate: async (): Promise<string> => {
    if (!process.env.PAYMOB_API_KEY) {
      throw new Error(
        "PAYMOB_API_KEY is not configured. Please set it in your .env file."
      );
    }

    try {
      const response = await fetch(`${PAYMOB_API_URL}/auth/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.PAYMOB_API_KEY,
        }),
      });

      const data: PaymobAuthResponse = await response.json();

      if (!response.ok) {
        console.error(
          "❌ Paymob Authentication Failed:",
          JSON.stringify(data, null, 2)
        );
        throw new Error(
          `Paymob authentication failed: ${data.detail || response.statusText}`
        );
      }

      if (!data.token) {
        throw new Error("Paymob authentication response missing token");
      }

      console.log("✅ Paymob authentication successful");
      return data.token;
    } catch (error) {
      console.error("❌ Paymob Authentication Error:", error);
      throw error;
    }
  },

  registerOrder: async (
    token: string,
    amount: number,
    currency: string,
    merchantOrderId: string,
    items: any[] = []
  ): Promise<PaymobOrderResponse> => {
    try {
      // Paymob expects amount in cents
      const amountCents = Math.round(amount * 100);

      const payload = {
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
      };

      console.log(
        "📦 Paymob Register Order Payload:",
        JSON.stringify(payload, null, 2)
      );

      const response = await fetch(`${PAYMOB_API_URL}/ecommerce/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: PaymobOrderResponse = await response.json();

      if (!response.ok) {
        console.error(
          "❌ Paymob Order Registration Failed:",
          JSON.stringify(data, null, 2)
        );
        throw new Error(
          `Paymob order registration failed: ${
            data.detail || response.statusText
          }`
        );
      }

      if (!data.id) {
        throw new Error("Paymob order registration response missing order ID");
      }

      console.log(`✅ Paymob order registered successfully (ID: ${data.id})`);

      return data;
    } catch (error) {
      console.error("❌ Paymob Order Registration Error:", error);
      throw error;
    }
  },

  getPaymentKey: async (
    token: string,
    orderId: string,
    billingData: PaymobBillingData,
    amount: number,
    currency: string = "EGP"
  ): Promise<string> => {
    if (!process.env.PAYMOB_INTEGRATION_ID) {
      throw new Error(
        "PAYMOB_INTEGRATION_ID is not configured. Please set it in your .env file."
      );
    }

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

      console.log(
        "🔑 Paymob Payment Key Request:",
        JSON.stringify(payload, null, 2)
      );

      const response = await fetch(
        `${PAYMOB_API_URL}/acceptance/payment_keys`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data: PaymobPaymentKeyResponse = await response.json();

      if (!response.ok) {
        console.error(
          "❌ Paymob Payment Key Failed:",
          JSON.stringify(data, null, 2)
        );
        throw new Error(
          `Paymob payment key request failed: ${
            data.detail || response.statusText
          }`
        );
      }

      if (!data.token) {
        throw new Error("Paymob payment key response missing token");
      }

      console.log("✅ Paymob payment key generated successfully");
      return data.token;
    } catch (error) {
      console.error("❌ Paymob Payment Key Error:", error);
      throw error;
    }
  },

  getWalletPaymentKey: async (
    token: string,
    orderId: string,
    mobileNumber: string,
    walletType: string,
    amount: number
  ): Promise<string> => {
    if (!process.env.PAYMOB_WALLET_INTEGRATION_ID) {
      throw new Error(
        "PAYMOB_WALLET_INTEGRATION_ID is not configured. Please set it in your .env file."
      );
    }

    try {
      const amountCents = Math.round(amount * 100);

      // Map wallet types to Paymob's expected format
      const walletTypeMapping: { [key: string]: string } = {
        VodafoneCash: "vodafone-cash",
        EtisalatCash: "etisalat-cash",
        OrangeMoney: "orange-money",
        BankWallet: "bank-wallet",
        AmanWallet: "aman-wallet",
      };

      // Ensure mobile number is in correct format for wallet payments
      const cleanNumber = mobileNumber.replace(/[^\d]/g, "");
      const formattedMobile = cleanNumber.startsWith("20")
        ? cleanNumber
        : `20${cleanNumber}`;

      const payload = {
        auth_token: token,
        amount_cents: amountCents,
        expiration: 3600, // 1 hour
        order_id: orderId,
        integration_id: Number(process.env.PAYMOB_WALLET_INTEGRATION_ID),
        billing_data: {
          first_name: "Wallet",
          last_name: "Payment",
          email: `wallet_${formattedMobile}@example.com`,
          phone_number: formattedMobile,
          apartment: "1",
          floor: "1",
          street: "Cairo",
          building: "1",
          shipping_method: "PKG",
          postal_code: "11511",
          city: "Cairo",
          country: "EG",
          state: "Cairo",
        },
        currency: "EGP",
        // Mobile wallet payment data
        source_data: {
          identifier: formattedMobile,
          type: "wallet",
          subtype: walletTypeMapping[walletType] || walletType.toLowerCase().replace(/\s+/g, '-'),
        },
      };

      console.log(
        "💰 Paymob Wallet Payment Key Request:",
        JSON.stringify(payload, null, 2)
      );

      const response = await fetch(
        `${PAYMOB_API_URL}/acceptance/payment_keys`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data: PaymobPaymentKeyResponse = await response.json();

      console.log(
        "💰 Paymob Wallet Payment Response Status:",
        response.status,
        data
      );

      if (!response.ok) {
        console.error(
          "❌ Paymob Wallet Payment Key Failed:",
          JSON.stringify(data, null, 2)
        );
        console.error("💰 Request payload that failed:", JSON.stringify(payload, null, 2));
        throw new Error(
          `Paymob wallet payment key request failed: ${
            data.detail || response.statusText
          }`
        );
      }

      if (!data.token) {
        throw new Error("Paymob wallet payment key response missing token");
      }

      console.log("✅ Paymob wallet payment key generated successfully");
      return data.token;
    } catch (error) {
      console.error("❌ Paymob Wallet Payment Key Error:", error);
      throw error;
    }
  },

  verifyHmac: (data: any, hmac: string) => {
    if (!process.env.PAYMOB_HMAC_SECRET) {
      console.error("PAYMOB_HMAC_SECRET is not set");
      return false;
    }

    // HMAC keys for both card and wallet transactions
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

    const calculatedHmac = createHmac("sha512", process.env.PAYMOB_HMAC_SECRET!)
      .update(concatenatedString)
      .digest("hex");

    console.log("Paymob Debug - Received HMAC:", hmac);
    console.log("Paymob Debug - Calculated HMAC:", calculatedHmac);
    console.log("Paymob Debug - Concatenated String:", concatenatedString);
    console.log("Paymob Debug - Data Object:", JSON.stringify(data, null, 2));

    return calculatedHmac === hmac;
  },
};
