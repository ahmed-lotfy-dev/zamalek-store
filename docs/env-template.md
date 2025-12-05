# Environment Variables Template

# Copy this file to .env and fill in your actual values

# ============================================

# Database Configuration

# ============================================

# PostgreSQL connection string

# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE

DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db"

# ============================================

# Authentication (Better Auth)

# ============================================

# Secret key for session encryption

# Generate with: openssl rand -base64 32

BETTER_AUTH_SECRET="your-secret-key-here"

# Base URL of your application

# Local: http://localhost:3000

# Production: https://yourdomain.com

BETTER_AUTH_URL="http://localhost:3000"

# ============================================

# Paymob Payment Gateway

# ============================================

# Find these in your Paymob Dashboard: https://accept.paymob.com/portal2

# API Key (Secret Key, NOT Public Key)

# Location: Settings → Account Info → API Keys

PAYMOB_API_KEY="your_paymob_api_key_here"

# Integration ID for Card Payments

# Location: Developers → Payment Integrations → Card Payment → Integration ID

PAYMOB_INTEGRATION_ID="1234567"

# iFrame ID for custom payment form

# Location: Developers → iFrames → Your iframe → iFrame ID

PAYMOB_IFRAME_ID="9876543"

# HMAC Secret for webhook verification

# Location: Developers → HMAC Calculation → HMAC Secret

PAYMOB_HMAC_SECRET="your_hmac_secret_here"

# ============================================

# Kashier Payment Gateway

# ============================================

# Find these in your Kashier Dashboard: https://merchant.kashier.io

# API Key

# Location: Dashboard → Developers → API Keys

KASHIER_API_KEY="your_kashier_api_key_here"

# Merchant ID

# Location: Dashboard → Settings → Merchant ID

KASHIER_MERCHANT_ID="your_merchant_id_here"

# Secret Key for webhook verification

# Location: Dashboard → Developers → Secret Key

KASHIER_SECRET_KEY="your_kashier_secret_key_here"

# Mode: test or live

KASHIER_MODE="test"

# ============================================

# Stripe Payment Gateway (Optional)

# ============================================

# Only needed if you're using Stripe alongside Paymob

# Find at: https://dashboard.stripe.com/apikeys

# Stripe Secret Key

STRIPE*SECRET_KEY="sk_test*..."

# Stripe Publishable Key

NEXT*PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test*..."

# ============================================

# Application Configuration

# ============================================

# Public URL of your application (for redirects and webhooks)

NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ============================================

# Optional: Email Configuration

# ============================================

# If you want to send order confirmation emails

# SMTP_HOST="smtp.gmail.com"

# SMTP_PORT="587"

# SMTP_USER="your-email@gmail.com"

# SMTP_PASS="your-app-password"

# ============================================

# Development Tools

# ============================================

# Uncomment for detailed logging in development

# DEBUG="true"

# LOG_LEVEL="debug"
