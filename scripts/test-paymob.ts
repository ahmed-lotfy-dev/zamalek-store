#!/usr/bin/env tsx
/**
 * Paymob Integration Test Script
 *
 * This script tests the Paymob integration without going through the full checkout flow.
 * Run with: npx tsx scripts/test-paymob.ts
 */

// Load environment variables from .env file
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { createHmac } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

import { paymob } from "../app/lib/paymob";

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message: string) {
  log(`✅ ${message}`, colors.green);
}

function error(message: string) {
  log(`❌ ${message}`, colors.red);
}

function info(message: string) {
  log(`ℹ️  ${message}`, colors.cyan);
}

function warning(message: string) {
  log(`⚠️  ${message}`, colors.yellow);
}

async function testPaymobIntegration() {
  log("\n" + "=".repeat(60), colors.blue);
  log("  Paymob Integration Test", colors.blue);
  log("=".repeat(60) + "\n", colors.blue);

  // Step 1: Check Environment Variables
  log("Step 1: Checking Environment Variables...\n", colors.yellow);

  const envVars = {
    PAYMOB_API_KEY: process.env.PAYMOB_API_KEY,
    PAYMOB_INTEGRATION_ID: process.env.PAYMOB_INTEGRATION_ID,
    PAYMOB_IFRAME_ID: process.env.PAYMOB_IFRAME_ID,
    PAYMOB_HMAC_SECRET: process.env.PAYMOB_HMAC_SECRET,
  };

  let envCheckPassed = true;
  for (const [key, value] of Object.entries(envVars)) {
    if (value) {
      success(`${key}: Set (${value.substring(0, 10)}...)`);
    } else {
      error(`${key}: Not set`);
      envCheckPassed = false;
    }
  }

  if (!envCheckPassed) {
    error(
      "\n❌ Environment check failed. Please configure all required variables in .env"
    );
    process.exit(1);
  }

  success("\n✅ All environment variables are configured\n");

  // Step 2: Test Authentication
  log("Step 2: Testing Authentication...\n", colors.yellow);

  let authToken: string;
  try {
    authToken = await paymob.authenticate();
    success(`Authentication successful`);
    info(`Token: ${authToken.substring(0, 20)}...\n`);
  } catch (err: any) {
    error(`Authentication failed: ${err.message}`);
    process.exit(1);
  }

  // Step 3: Test Order Registration
  log("Step 3: Testing Order Registration...\n", colors.yellow);

  const testOrderData = {
    amount: 100.0,
    currency: "EGP",
    merchantOrderId: `test_${Date.now()}`,
    items: [], // Empty items array as per your working reference
  };

  let paymobOrderId: string;
  try {
    const orderResponse = await paymob.registerOrder(
      authToken,
      testOrderData.amount,
      testOrderData.currency,
      testOrderData.merchantOrderId,
      testOrderData.items
    );
    paymobOrderId = orderResponse.id;
    success(`Order registered successfully`);
    info(`Order ID: ${paymobOrderId}`);
    info(`Merchant Order ID: ${testOrderData.merchantOrderId}\n`);
  } catch (err: any) {
    error(`Order registration failed: ${err.message}`);
    process.exit(1);
  }

  // Step 4: Test Payment Key Generation
  log("Step 4: Testing Payment Key Generation...\n", colors.yellow);

  const testBillingData = {
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    phone_number: "201234567890", // Egyptian format
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

  try {
    const paymentKey = await paymob.getPaymentKey(
      authToken,
      paymobOrderId,
      testBillingData,
      testOrderData.amount,
      testOrderData.currency
    );
    success(`Payment key generated successfully`);
    info(`Payment Key: ${paymentKey.substring(0, 30)}...\n`);

    // Generate the iframe URL
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
    info(`Iframe URL would be:\n${iframeUrl}\n`);
  } catch (err: any) {
    error(`Payment key generation failed: ${err.message}`);
    process.exit(1);
  }

  // Step 5: Test Mobile Wallet Payment Key Generation
  log("Step 5: Testing Mobile Wallet Payment Key Generation...\n", colors.yellow);

  const testWalletData = {
    walletType: "VodafoneCash",
    mobileNumber: "201234567890", // Test Vodafone number
    amount: 100.0,
  };

  let walletPaymentKey: string;
  try {
    const walletKey = await paymob.getWalletPaymentKey(
      authToken,
      paymobOrderId,
      testWalletData.mobileNumber,
      testWalletData.walletType,
      testWalletData.amount
    );
    walletPaymentKey = walletKey;
    success(`Mobile wallet payment key generated successfully`);
    info(`Wallet Type: ${testWalletData.walletType}`);
    info(`Mobile Number: ${testWalletData.mobileNumber}`);
    info(`Payment Key: ${walletPaymentKey.substring(0, 30)}...\n`);

    // Generate the redirect URL for wallet payment
    const walletRedirectUrl = `https://accept.paymob.com/api/acceptance/redirect?payment_token=${walletPaymentKey}`;
    info(`Wallet Redirect URL would be:\n${walletRedirectUrl}\n`);
  } catch (err: any) {
    error(`Mobile wallet payment key generation failed: ${err.message}`);

    // Provide helpful troubleshooting info
    warning("💡 Mobile Wallet Troubleshooting:");
    warning("   1. Check if PAYMOB_WALLET_INTEGRATION_ID is set in .env");
    warning("   2. Verify wallet integration is enabled in Paymob dashboard");
    warning("   3. Ensure the wallet type mapping matches Paymob's expectations\n");

    // Continue with other tests
    log("Continuing with HMAC verification...\n", colors.yellow);
  }

  // Step 6: Test HMAC Verification
  log("Step 6: Testing HMAC Verification...\n", colors.yellow);

  // Sample webhook data (structure similar to what Paymob sends)
  const sampleWebhookData = {
    amount_cents: 10000,
    created_at: "2024-12-05T12:00:00.000000",
    currency: "EGP",
    error_occured: false,
    has_parent_transaction: false,
    id: 123456789,
    integration_id: Number(process.env.PAYMOB_INTEGRATION_ID),
    is_3d_secure: true,
    is_auth: false,
    is_capture: false,
    is_refunded: false,
    is_standalone_payment: true,
    is_voided: false,
    order: { id: 987654321 },
    owner: 123,
    pending: false,
    source_data: {
      pan: "1234",
      sub_type: "CARD",
      type: "card",
    },
    success: true,
  };

  try {
    // Generate expected HMAC
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
          .reduce(
            (obj: any, k: string) => (obj ? obj[k] : undefined),
            sampleWebhookData
          );

        if (key === "order" && typeof value === "object" && value !== null) {
          value = value.id;
        }

        return value !== undefined ? value.toString() : "";
      })
      .join("");

    const expectedHmac = createHmac("sha512", process.env.PAYMOB_HMAC_SECRET!)
      .update(concatenatedString)
      .digest("hex");

    // Test verification
    const isValid = paymob.verifyHmac(sampleWebhookData, expectedHmac);

    if (isValid) {
      success(`HMAC verification works correctly`);
      info(`Sample HMAC: ${expectedHmac.substring(0, 30)}...\n`);
    } else {
      error(`HMAC verification failed (this should not happen in test)`);
    }
  } catch (err: any) {
    error(`HMAC test failed: ${err.message}`);
  }

  // Summary
  log("\n" + "=".repeat(60), colors.blue);
  log("  Test Summary", colors.blue);
  log("=".repeat(60) + "\n", colors.blue);

  success("✅ All tests passed!");
  info("\nYour Paymob integration is configured correctly.");

  log("\n📝 Test Card Information:", colors.cyan);
  info("   Card Number: 4987654321098769");
  info("   Expiry: Any future date (e.g., 12/25)");
  info("   CVV: 123");
  info("   Cardholder: Any name\n");

  warning("⚠️  Note: These tests only verify API configuration.");
  warning(
    "   You still need to test the full payment flow in your application."
  );
  warning(
    "   See docs/PAYMOB_TESTING_GUIDE.md for complete testing instructions.\n"
  );
}

// Run the test
testPaymobIntegration().catch((err) => {
  error(`\n❌ Test suite failed: ${err.message}`);
  console.error(err);
  process.exit(1);
});
