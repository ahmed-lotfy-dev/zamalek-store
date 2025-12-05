# Paymob Integration Guide

This guide details the secure and idempotent implementation of Paymob payment gateway in a Next.js App Router application.

## 1. Architecture Overview

The integration follows a 3-step API flow for initiation and a Webhook for final status updates.

### Flow Diagram

1.  **User** clicks "Place Order".
2.  **Server** calls Paymob API:
    - `Authentication Request` -> Get Token
    - `Order Registration API` -> Get Paymob Order ID
    - `Payment Key Request` -> Get Payment Key
3.  **Client** redirects to Paymob Iframe/Page using the Payment Key.
4.  **User** completes payment.
5.  **Paymob** redirects User to `success` or `error` page.
6.  **Paymob** sends a server-to-server **Webhook** (POST request) with the final transaction status.

## 2. Security Best Practices

### HMAC Signature Verification

**Crucial:** Never trust the data in the client-side redirect. Always rely on the server-to-server Webhook.
Paymob signs every webhook request using an HMAC (Hash-based Message Authentication Code). We must verify this signature to ensure the request actually came from Paymob and wasn't tampered with.

**Algorithm:**

1.  Concatenate specific fields from the request body in a strict lexicographical order.
2.  Hash the concatenated string using `SHA512` and your `HMAC_SECRET`.
3.  Compare the result with the `hmac` query param sent by Paymob.

### Environment Variables

Store these secrets in `.env` and **never** expose them to the client (no `NEXT_PUBLIC_` prefix).

- `PAYMOB_API_KEY`
- `PAYMOB_INTEGRATION_ID`
- `PAYMOB_IFRAME_ID`
- `PAYMOB_HMAC_SECRET`

## 3. Idempotency Implementation

**Problem:** Paymob (like any webhook provider) may send the same webhook multiple times (retries) if your server doesn't respond quickly or if there's a network glitch.
**Risk:** Processing the same payment twice (e.g., granting double credits, sending two emails).

**Solution:**

1.  **Database Tracking:** The `Payment` model must have a unique constraint on `transactionId`.
2.  **Check-Then-Act:**
    - When a webhook arrives, check if a `Payment` record with this `transactionId` already exists.
    - **If exists:** Return `200 OK` immediately. Do **not** process again.
    - **If new:** Process the payment, update the order, save the `Payment` record, then return `200 OK`.

## 4. Implementation Steps

### Step 1: Database Schema

Ensure `Payment` model supports Paymob fields.

```prisma
model Payment {
  id            String   @id @default(cuid())
  orderId       String   @unique
  provider      String   @default("PAYMOB")
  transactionId String   @unique // Critical for idempotency
  amount        Decimal
  currency      String
  status        String   // "SUCCESS", "PENDING", "REFUNDED"
  createdAt     DateTime @default(now())
}
```

### Step 2: Utility Function (`app/lib/paymob.ts`)

Create a helper to handle the Paymob API chain.

```typescript
// Pseudo-code for structure
export const paymob = {
  authenticate: async () => { ... },
  registerOrder: async (token, amount, currency, merchantOrderId) => { ... },
  getPaymentKey: async (token, orderId, billingData, amount) => { ... },
  verifyHmac: (data, hmac) => { ... } // SHA512 hashing logic
};
```

### Step 3: Checkout Action (`app/lib/actions/checkout.ts`)

Update `createOrder` to handle the Paymob flow.

```typescript
if (paymentMethod === "paymob") {
  const token = await paymob.authenticate();
  const paymobOrder = await paymob.registerOrder(
    token,
    total,
    "EGP",
    internalOrderId
  );
  const paymentKey = await paymob.getPaymentKey(
    token,
    paymobOrder.id,
    userBillingData,
    total
  );

  return {
    success: true,
    url: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`,
  };
}
```

### Step 4: Webhook Handler (`app/api/payment/callback/route.ts`)

This is the most critical part for security and reliability.

```typescript
export async function POST(req: Request) {
  const data = await req.json();
  const { hmac } = req.nextUrl.searchParams;

  // 1. Security Check
  if (!paymob.verifyHmac(data.obj, hmac)) {
    return new Response("Invalid Signature", { status: 403 });
  }

  // 2. Idempotency Check
  const existingPayment = await prisma.payment.findUnique({
    where: { transactionId: data.obj.id }
  });

  if (existingPayment) {
    return new Response("Already Processed", { status: 200 });
  }

  // 3. Process Payment
  if (data.obj.success) {
    await prisma.$transaction([
      prisma.payment.create({ ... }),
      prisma.order.update({
        where: { id: merchantOrderId },
        data: { status: "PAID", isPaid: true }
      })
    ]);
  }

  return new Response("Received", { status: 200 });
}
```

## 5. Testing

1.  Use Paymob Test Card (usually provided in dashboard).
2.  Check logs for "HMAC Verified" messages.
3.  Simulate double webhook (using Postman) to verify idempotency logic works.
