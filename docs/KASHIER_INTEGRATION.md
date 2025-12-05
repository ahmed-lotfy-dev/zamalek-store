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

Kashier uses **TWO different keys** for different purposes. You need BOTH:

#### Payment API Key (for generating payment hashes)

1. Go to: **Dashboard** → **Developers** → **Payment API Keys**
2. You'll see a default key or can generate a new one
3. Copy the **Payment API Key** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
4. This is your `KASHIER_API_KEY`

**Purpose:** Used to generate the payment hash when creating payment orders.

#### Secret Key (for webhook verification)

1. Go to: **Dashboard** → **Developers** → **Secret Keys**
2. Click to reveal or copy the **Secret Key**
3. This is your `KASHIER_SECRET_KEY`

**Purpose:** Used to verify webhook signatures when Kashier sends payment notifications to your server.

> **⚠️ CRITICAL:** These are TWO DIFFERENT keys! Do not confuse them:
>
> - `KASHIER_API_KEY` = Payment API Key (for creating orders)
> - `KASHIER_SECRET_KEY` = Secret Key (for webhooks)

#### Merchant ID

1. Go to: **Dashboard** → **Settings** → **Account Information**
2. Find your **Merchant ID** (format: `MID-xxxxx-xxx`, e.g., `MID-41194-643`)
3. This is your `KASHIER_MERCHANT_ID`

### 3. Configure Environment Variables

Add to your `.env` file:

```bash
# Kashier Payment Gateway
KASHIER_API_KEY="your_payment_api_key_here"          # From "Payment API Keys" section
KASHIER_SECRET_KEY="your_secret_key_here"            # From "Secret Keys" section
KASHIER_MERCHANT_ID="MID-xxxxx-xxx"                  # Your merchant ID
KASHIER_MODE="test"                                   # Use "test" for testing, "live" for production
```

**Important Notes:**

- All THREE environment variables are required
- Payment API Key is used when generating payment URLs
- Secret Key is used when verifying webhooks
- Never commit these keys to version control

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

### Issue 5: Webhook Error - "Content-Type was not one of multipart/form-data"

**Symptoms:**

```
Kashier Webhook Error: TypeError: Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded".
```

**Cause:**
Kashier sends webhook data as **URL parameters**, not as FormData or JSON body.

**Solution:**
This is already fixed in the latest code. The webhook handler now:

1. Reads data from URL query parameters (e.g., `?merchantOrderId=xxx&amount=59.99`)
2. Falls back to JSON body if no URL params
3. Properly processes Kashier's webhook format

**If you see this error:**

1. Make sure you have the latest code from the repository
2. The fix is in `app/api/kashier/callback/route.ts`
3. Restart your server after updating

---

### Issue 6: Orders Not Marked as PAID (Webhook Not Received)

**Symptoms:**

- Payment completes successfully on Kashier
- User redirected to success page
- Order remains in "PENDING" status
- No webhook logs in server console

**Root Cause:**
`NEXT_PUBLIC_APP_URL` not set correctly in production environment.

**Step-by-Step Fix:**

1. **Check Current Setting:**

   - Look at your production environment variables
   - Check what `NEXT_PUBLIC_APP_URL` is set to
   - If it's `http://localhost:3000` or not set, that's the problem

2. **Set Correct URL:**

   ```bash
   NEXT_PUBLIC_APP_URL="https://your-actual-domain.com"
   ```

   Replace with your actual deployed domain (e.g., `https://mystore.vercel.app`)

3. **Restart Your Application:**

   - If using PM2: `pm2 restart all`
   - If using Vercel/Netlify: Redeploy or restart

4. **Verify the Fix:**

   - Make a new test payment
   - Check server logs for:
     ```
     📥 Kashier Webhook Received
     ✅ Kashier signature verified successfully
     ✅ Order marked as PAID
     ```

5. **Test Webhook Endpoint:**
   - Visit: `https://your-domain.com/api/kashier/test`
   - Should return: `{"status": "ok", "message": "Kashier webhook endpoint is reachable"}`
   - If this fails, your server has connectivity issues

**How to Debug:**

1. **Check Payment URL:**
   When you make a payment, look at the Kashier payment page URL. It should contain:

   ```
   serverWebhook=https://your-domain.com/api/kashier/callback
   ```

   NOT:

   ```
   serverWebhook=http://localhost:3000/api/kashier/callback
   ```

2. **Check Server Logs:**
   Look for these log messages:

   ```
   📝 Kashier Hash Generation:
      Path: /?payment=MID-xxxxx-xxx.order_id.amount.EGP
      Hash: [hash]
   ✅ Kashier payment URL generated successfully
   ```

   After payment, you should see:

   ```
   📥 Kashier Webhook Received
   Kashier Callback Data: {...}
   ✅ Kashier signature verified successfully
   📦 Processing transaction xxx for order yyy
   ✅ Order yyy marked as PAID
   ```

3. **If No Webhook Logs:**
   - Webhook is not reaching your server
   - Check `NEXT_PUBLIC_APP_URL` is set correctly
   - Verify your server is publicly accessible
   - Check firewall settings

**Common Mistakes:**

- ❌ Setting `NEXT_PUBLIC_APP_URL` in local `.env` but not in production
- ❌ Using `http://` instead of `https://` for production
- ❌ Forgetting to restart server after changing environment variables
- ❌ Testing on localhost without ngrok

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
