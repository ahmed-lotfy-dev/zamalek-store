import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const webhookData = {
  amount: "29.99",
  channel: "online | e-commerce",
  creationDate: "2025-12-06T00:22:13.854Z",
  currency: "EGP",
  kashierOrderId: "ae615322-7c20-4bd2-a50a-428510574302",
  merchantOrderId: "cmitjtmvu00052dhlp03etmug",
  method: "card",
  orderReference: "TEST-ORD-193421142",
  status: "SUCCESS",
  transactionId: "TX-4119464366",
  transactionResponseCode: "00",
};

const webhookSignature =
  "4074b354d8d333bbed37ed308176df611af3e4dbdee7a5b4bd39b8feb112bf5c";

const webhookKeys = [
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

const redirectData = {
  amount: "29.99",
  cardBrand: "Mastercard",
  cardDataToken: "eda7f41b-db43-439b-922c-c134c7683cc6",
  currency: "EGP",
  maskedCard: "512345******2346",
  merchantOrderId: "cmitjtmvu00052dhlp03etmug",
  mode: "test",
  orderId: "ae615322-7c20-4bd2-a50a-428510574302",
  orderReference: "TEST-ORD-193421142",
  paymentStatus: "SUCCESS",
  transactionId: "TX-4119464366",
};

const redirectSignature =
  "4548108c1394753ad30f2e7345c5dea01a7e4d1b0c61dcfacaf69b5e251a3b09";

const redirectKeys = [
  "amount",
  "cardBrand",
  "cardDataToken",
  "currency",
  "maskedCard",
  "merchantOrderId",
  "mode",
  "orderId",
  "orderReference",
  "paymentStatus",
  "transactionId",
];

function tryStrategies(
  name: string,
  data: any,
  keys: string[],
  expectedSig: string,
  urlOrderKeys?: string[]
) {
  console.log(`\n--- Testing ${name} ---`);

  const secrets = {
    SECRET_KEY: process.env.KASHIER_SECRET_KEY,
    API_KEY: process.env.KASHIER_API_KEY,
    MID: "MID-41194-643",
  };

  for (const [secretName, secret] of Object.entries(secrets)) {
    if (!secret) {
      console.log(`Skipping ${secretName} (not set)`);
      continue;
    }

    console.log(`Using ${secretName}: ${secret.substring(0, 5)}...`);

    // Strategy 1: Alphabetical Keys (Current)
    const sortedKeys = [...keys].sort();
    testKeys(secret, data, sortedKeys, "Alphabetical", expectedSig);

    // Strategy 2: URL Order Keys (if provided)
    if (urlOrderKeys) {
      testKeys(secret, data, urlOrderKeys, "URL Order", expectedSig);
    }
  }
}

function testKeys(
  secret: string,
  data: any,
  keys: string[],
  strategyName: string,
  expectedSig: string
) {
  // 1. Raw
  let qs = "";
  keys.forEach((k) => {
    if (data[k] !== undefined) {
      qs += `&${k}=${data[k]}`;
    }
  });
  qs = qs.substring(1);
  check(secret, qs, `${strategyName} (Raw)`, expectedSig);

  // 2. Encoded
  let qsEnc = "";
  keys.forEach((k) => {
    if (data[k] !== undefined) {
      qsEnc += `&${k}=${encodeURIComponent(data[k])}`;
    }
  });
  qsEnc = qsEnc.substring(1);
  check(secret, qsEnc, `${strategyName} (Encoded)`, expectedSig);
}

function check(
  secret: string,
  data: string,
  strategy: string,
  expected: string
) {
  const hash = crypto.createHmac("sha256", secret).update(data).digest("hex");
  if (hash === expected) {
    console.log(`✅ MATCH FOUND! Strategy: ${strategy}`);
    console.log(`   Data: ${data}`);
  } else {
    // console.log(`   Failed: ${strategy}`);
    // console.log(`   Hash: ${hash}`);
    // console.log(`   Data: ${data}`);
  }
}

tryStrategies("Webhook", webhookData, webhookKeys, webhookSignature);

const redirectUrlOrder = [
  "paymentStatus",
  "cardDataToken",
  "maskedCard",
  "merchantOrderId",
  "orderId",
  "cardBrand",
  "orderReference",
  "transactionId",
  "amount",
  "currency",
];

tryStrategies(
  "Redirect",
  redirectData,
  redirectKeys,
  redirectSignature,
  redirectUrlOrder
);
