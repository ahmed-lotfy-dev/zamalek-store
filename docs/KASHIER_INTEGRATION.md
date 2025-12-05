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

Once logged in, get your credentials:

**API Key:**

1. Go to: **Dashboard** → **Developers** → **API Keys**
2. Copy your **Test API Key**
3. This is your `KASHIER_API_KEY`

**Merchant ID:**

1. Go to: **Dashboard** → **Settings** → **Account Information**
2. Find your **Merchant ID**
3. This is your `KASHIER_MERCHANT_ID`

**Secret Key:**

1. Go to: **Dashboard** → **Developers** → **Secret Key**
2. Copy your **Secret Key**
3. This is your `KASHIER_SECRET_KEY`

### 3. Configure Environment Variables

Add to your `.env` file:

```bash
# Kashier Payment Gateway
KASHIER_API_KEY="your_api_key_from_dashboard"
KASHIER_MERCHANT_ID="your_merchant_id"
KASHIER_SECRET_KEY="your_secret_key"
KASHIER_MODE="test"  # Change to "live" for production
```

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

### Testing Steps

1. **Start your development server**:

   ```bash
   npm run dev
   ```

2. **Navigate to checkout**: http://localhost:3000/checkout

3. **Select "Kashier"** as payment method

4. **Fill checkout form** with test data

5. **Use test card** `4111111111111111`

6. **Complete payment** on Kashier page

7. **Verify**:
   - Order status changed to "PAID"
   - Payment record created in database
   - Stock updated

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

### Issue 1: "Kashier credentials not configured"

**Symptoms:**

```
❌ Kashier credentials not configured. Please set KASHIER_API_KEY and KASHIER_MERCHANT_ID in your .env file.
```

**Solution:**

1. Verify `.env` file exists in project root
2. Check all three Kashier variables are set:
   - `KASHIER_API_KEY`
   - `KASHIER_MERCHANT_ID`
   - `KASHIER_SECRET_KEY`
3. Restart development server

---

### Issue 2: "Invalid Signature"

**Symptoms:**

```
❌ Invalid Kashier callback signature
```

**Causes & Solutions:**

- **Wrong Secret Key**: Verify you copied the correct secret key from dashboard
- **Extra spaces**: Check for trailing spaces in `.env` values
- **Test vs Live**: Ensure using test credentials in test mode

---

### Issue 3: Payment succeeds but order not updated

**Symptoms:**

- Payment shows successful on Kashier
- Order status still "PENDING"
- No payment record in database

**Debug Steps:**

1. Check webhook URL configured in Kashier dashboard
2. If using ngrok, ensure it's still running
3. Check server logs for webhook receipt
4. Verify signature verification passes

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
