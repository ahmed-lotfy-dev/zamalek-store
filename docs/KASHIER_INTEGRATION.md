# Kashier Payment Gateway Integration Guide

Complete guide for integrating Kashier payment gateway into your e-commerce application.

## Overview

Kashier is a leading Egyptian payment gateway that provides secure online payment processing for businesses across the MENA region. This integration enables your customers to pay via credit/debit cards through Kashier's secure platform.

### Why Kashier?

- ✅ **Easier Setup** - Instant sandbox access, no waiting for manual activation
- ✅ **Better Documentation** - Clear, comprehensive API docs
- ✅ **Faster Support** - Typically responds within 12-24 hours
- ✅ **Developer-Friendly** - Modern API with great error messages
- ✅ **Wide Acceptance** - Supports all major card types in Egypt

---

## Getting Started

### 1. Create Kashier Account

1. Visit [Kashier Sign Up](https://kashier.io/signup)
2. Complete registration with:

   - Business name
   - Contact email
   - Phone number
   - Business details

3. Verify your email address
4. You'll be automatically logged into your dashboard

### 2. Get API Credentials

Once logged in, get your credentials from the Kashier dashboard:

**Merchant ID:** (Format: `MID-xxxxx-xxx`)

1. Go to: **Dashboard** → **Settings** → **Account Information**
2. Find your **Merchant ID** (e.g., `MID-41194-643`)
3. This is your `KASHIER_MERCHANT_ID`

**API Key:** (IMPORTANT - This is used for hash generation)

1. Go to: **Dashboard** → **Developers** → **API Keys**
2. Look for **"API Key"** or **"Test API Key"**
3. Copy the **FULL key** (it's a long alphanumeric string)
4. This is your `KASHIER_API_KEY`

> **⚠️ CRITICAL:** Make sure you copy the complete API key. If you get "Forbidden request" errors, double-check this key. It should be a long string (50+ characters).

### 3. Configure Environment Variables

Add to your `.env` file:

```bash
# Kashier Payment Gateway
KASHIER_API_KEY="your_complete_api_key_here"  # Long string from API Keys section
KASHIER_MERCHANT_ID="MID-xxxxx-xxx"          # Your merchant ID
KASHIER_MODE="test"                           # Use "test" for testing, "live" for production
```

**Note:** You don't need `KASHIER_SECRET_KEY` for the Hosted Payment Page integration. Only `API_KEY` and `MERCHANT_ID` are required.

---

## Integration Architecture

### Flow Diagram

```
Customer Checkout
       ↓
Selects "Kashier" Payment
       ↓
Server creates Kashier order
       ↓
Customer redirected to Kashier
       ↓
Customer enters card details
       ↓
Kashier processes payment
       ↓
Kashier sends webhook to your server
       ↓
Your server verifies signature & updates order
       ↓
Customer redirected back to your site
```

### Files Involved

- **`app/lib/kashier.ts`** - Kashier API wrapper
- **`app/lib/actions/checkout.ts`** - Checkout flow with Kashier option
- **`app/api/kashier/callback/route.ts`** - Webhook handler

---

## Webhook Configuration

### Setting Up Webhooks

1. **Log in to Kashier Dashboard**
2. Go to: **Developers** → **Webhooks**
3. Add webhook URL:
   - **Production**: `https://yourdomain.com/api/kashier/callback`
   - **Development** (with ngrok\*\*: `https://your-ngrok-url.ngrok.io/api/kashier/callback`

### Webhook Security

Kashier uses **MD5 hash** for webhook verification:

```
hash = MD5(merchantOrderId + amount + currency + transactionId + secret_key)
```

Your webhook handler automatically verifies this before processing payments.

---

## Testing

### Test Environment

Kashier provides instant sandbox access:

- ✅ No manual activation required
- ✅ Test cards work immediately
- ✅ Full transaction simulation

### Test Cards

#### Successful Payment

```
Card Number: 4111111111111111
Expiry: 12/25 (any future date)
CVV: 123
Cardholder: Test User
```

#### Declined Payment

```
Card Number: 4000000000000002
Expiry: 12/25
CVV: 123
Cardholder: Test User
```

### Testing on Deployed Site (Recommended)

**For webhooks to work, test on your deployed site:**

1. **Deploy your code** to production (Vercel, Netlify, etc.)
2. **Add Kashier credentials** to your production environment variables
3. **Make a test payment** on your live site
4. **Webhooks will work automatically** (no ngrok needed)

**Why?** Kashier can't send webhooks to `localhost`. Your deployed site has a public URL that Kashier can reach.

### Testing Locally (Requires ngrok)

**Only if you need to test locally:**

1. **Start your development server**:

   ```bash
   npm run dev
   ```

2. **In another terminal, start ngrok**:

   ```bash
   ngrok http 3000
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

4. **Update your `.env`**:

   ```bash
   NEXT_PUBLIC_APP_URL="https://abc123.ngrok.io"
   ```

5. **Restart your dev server**

6. **Navigate to**: `https://abc123.ngrok.io/checkout`

7. **Complete payment** with test card `4111111111111111`

8. **Check server logs** for webhook receipt:
   ```
   📥 Kashier Webhook Received
   ✅ Kashier signature verified successfully
   ✅ Order marked as PAID
   ```

---

## Webhook Testing with ngrok

### Setup ngrok (for local development)

1. **Install ngrok**:

   ```bash
   npm install -g ngrok
   ```

2. **Start your dev server**:

   ```bash
   npm run dev
   ```

3. **In another terminal, start ngrok**:

   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

5. **Update Kashier webhook** in dashboard:

   ```
   https://abc123.ngrok.io/api/kashier/callback
   ```

6. **Complete a test payment**

7. **Check server logs** for webhook receipt:
   ```
   📥 Kashier Webhook Received
   ✅ Kashier signature verified successfully
   ✅ Payment successful - updating order
   ```

---

## Common Issues & Solutions

### Issue 1: "Forbidden request" Error

**Symptoms:**
Kashier payment page shows "Forbidden request" or "Something went wrong"

**Cause:**
Incorrect or incomplete `KASHIER_API_KEY`

**Solution:**

1. Go to Kashier Dashboard → Developers → API Keys
2. Copy the **complete API Key** (should be 50+ characters)
3. Make sure you copied the ENTIRE key (no spaces, no truncation)
4. Update `.env`:
   ```bash
   KASHIER_API_KEY="paste_complete_key_here"
   ```
5. Restart your server
6. Try payment again

**How to verify:** Check your server logs for:

```
📝 Kashier Hash Generation:
   Path: /?payment=MID-xxxxx-xxx.order_id.amount.EGP
   Hash: [long hash string]
```

If the hash is generated, your API key is being used. If Kashier still shows "Forbidden", the key itself is wrong.

---

### Issue 2: "Kashier credentials not configured"

**Symptoms:**

```
❌ Kashier credentials not configured
```

**Solution:**

1. Verify `.env` file exists in project root
2. Check both required variables are set:
   - `KASHIER_API_KEY`
   - `KASHIER_MERCHANT_ID`
3. Restart development server

---

### Issue 3: Payment succeeds but order not marked as PAID

**Symptoms:**

- Payment completes on Kashier
- User redirected to success page
- Order status still "PENDING"
- No payment record in database

**Cause:**
Webhook not received (testing on `localhost`)

**Solution:**
Either:

1. **Test on deployed site** (recommended - webhooks work automatically)
2. **Use ngrok** for local testing (see "Testing Locally" section above)

**How to verify webhook was received:**
Check server logs for:

```
📥 Kashier Webhook Received
✅ Kashier signature verified successfully
✅ Order marked as PAID
```

If you don't see these logs, the webhook didn't reach your server.

---

### Issue 4: "Invalid Signature" in webhook

**Symptoms:**

```
❌ Invalid Kashier callback signature
```

**Cause:**
API key mismatch between payment generation and webhook verification

**Solution:**

1. Ensure the same `KASHIER_API_KEY` is used in both environments
2. If testing locally with ngrok, make sure `.env` is loaded
3. Restart server after changing API key

---

### Issue 4: Redirect loop or no redirect

**Symptoms:**

- User stuck on Kashier page
- No redirect back to your site

**Solution:**

1. Check `success_url` and `failure_url` in kashier.ts
2. Verify `NEXT_PUBLIC_APP_URL` is set correctly
3. For local testing, use: `http://localhost:3000`
4. For production, use: `https://yourdomain.com`

---

## Production Checklist

Before going live with Kashier:

### 1. Get Live Credentials

- [ ] Switch from test to live API keys
- [ ] Update `KASHIER_API_KEY` with live key
- [ ] Update `KASHIER_SECRET_KEY` with live key
- [ ] Set `KASHIER_MODE="live"`

### 2. Configure Webhooks

- [ ] Update webhook URL to production domain
- [ ] Test webhook with live credentials
- [ ] Verify signature validation works

### 3. Test Live Environment

- [ ] Make small test transaction (e.g., 1 EGP)
- [ ] Verify order updates correctly
- [ ] Check customer receives confirmation
- [ ] Test refund process

### 4. Monitor & Maintain

- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Monitor transaction success rates
- [ ] Keep credentials secure (never in git)
- [ ] Regular backup of transaction logs

---

## API Reference

### Create Order

**Endpoint**: `POST https://api.kashier.io/payment/order`

**Request:**

```json
{
  "merchant_id": "your_merchant_id",
  "amount": "99.99",
  "currency": "EGP",
  "order_id": "unique_order_id",
  "customer_email": "customer@example.com",
  "customer_phone": "201234567890",
  "customer_name": "Customer Name",
  "mode": "test",
  "success_url": "https://yourdomain.com/checkout/success",
  "failure_url": "https://yourdomain.com/checkout/error",
  "callback_url": "https://yourdomain.com/api/kashier/callback"
}
```

**Response:**

```json
{
  "transaction_id": "txn_123456",
  "payment_url": "https://checkout.kashier.io/pay/txn_123456",
  "status": "pending",
  "order_id": "unique_order_id"
}
```

---

### Webhook Payload

**Method**: `POST`

**Payload:**

```json
{
  "merchantOrderId": "order_123",
  "transactionId": "txn_123456",
  "amount": "99.99",
  "currency": "EGP",
  "status": "success",
  "cardNumber": "4111",
  "hash": "calculated_md5_hash"
}
```

**Hash Calculation:**

```
MD5(merchantOrderId + amount + currency + transactionId + secret_key)
```

---

## Comparison with Other Gateways

| Feature           | Kashier      | Paymob          | Stripe     |
| ----------------- | ------------ | --------------- | ---------- |
| **Setup Time**    | Instant      | 1-2 days        | Instant    |
| **Test Access**   | Immediate    | Manual approval | Immediate  |
| **Egypt Focus**   | ✅ Optimized | ✅ Optimized    | ❌ Global  |
| **Local Cards**   | ✅ All cards | ✅ All cards    | ⚠️ Limited |
| **Documentation** | Excellent    | Good            | Excellent  |
| **Fees (Egypt)**  | Competitive  | Competitive     | Higher     |
| **Support**       | 12-24h       | 24-48h          | 24h        |

---

## Support

### Kashier Support Channels

- **Email**: techsupport@kashier.io
- **Documentation**: https://developers.kashier.io
- **Dashboard**: https://merchant.kashier.io
- **Status Page**: https://status.kashier.io

### When to Contact Support

Contact Kashier if you experience:

- Webhook not being received
- Test cards not working
- Need live credentials activation
- Transaction disputes
- Integration questions

---

## Next Steps

1. ✅ **Test integration** with test cards
2. ✅ **Verify webhooks** work correctly
3. ✅ **Test error scenarios** (declined cards, timeouts)
4. 📧 **Add email notifications** for successful payments
5. 🚀 **Go live** with production credentials

---

**Last Updated**: December 5, 2024
