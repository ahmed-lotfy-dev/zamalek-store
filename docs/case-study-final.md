# Case Study: Zamalek Store
**Building a Production-Ready Bilingual E-Commerce Platform for the Egyptian Market**

> **Role:** Full-Stack Developer  
> **Tech Stack:** Next.js 16, React 19, TypeScript, PostgreSQL, Prisma, Redis, BullMQ, Docker  
> **Payment Gateways:** Paymob, Kashier, Stripe  
> **Live Demo:** [zamalek-store.ahmedlotfy.site](https://zamalek-store.ahmedlotfy.site)

---

## The Challenge
Building an e-commerce store for **Zamalek SC** fans meant more than just listing products. I needed to solve three specific challenges relevant to the Egyptian market:
1. **Localization:** It had to work seamlessly in both Arabic (RTL) and English (LTR).
2. **Local Payments:** It needed to accept local payments (Paymob & Kashier) reliably.
3. **Performance:** Merchandise photos are heavy, but the site needed to load fast on mobile data.

## 1. Technical Architecture
I chose **Next.js 16 (App Router)** because it allows me to move heavy logic to the server and leverage React Server Components for optimal performance.

### Database & ORM
*   **PostgreSQL with Prisma 7.1**: I designed a comprehensive schema with 15 models to handle all aspects of the e-commerce platform. The schema handles bilingual data natively (e.g., `name_ar` and `name_en` columns) so I don't rely on fragile JSON files for product data.
*   **Type Safety**: Prisma provides end-to-end type safety from database to UI, catching errors at compile time.
*   **Migrations**: All schema changes are versioned and tracked through Prisma migrations.

### State Management
I built a **hybrid cart system** that adapts to user authentication status:
*   **Guest users**: Cart stored in `localStorage` for instant performance
*   **Logged-in users**: Cart synced to PostgreSQL database
*   **Auto-merge**: When guests log in, their local cart automatically merges with their database cart, ensuring no "lost" items during signup
*   **Persistence**: Cart survives page refreshes, browser restarts, and device switches (for authenticated users)

### Background Job Processing
Implemented **BullMQ with Redis** for reliable asynchronous task processing:
*   **Email Queue**: Order confirmations, status updates, and welcome emails processed in background
*   **Retry Logic**: Failed jobs automatically retry with exponential backoff (3 attempts)
*   **Worker Process**: Separate `worker.ts` process handles jobs independently from the main application
*   **Benefits**: Checkout responses are instant (~200ms), even though emails are being sent

## 2. Solving Real Problems

### 💳 The Payment Integration Struggle
Integrating Egyptian gateways like Paymob was the hardest part. The documentation can be tricky, and webhooks sometimes fail.
*   **The Fix:** I implemented **HMAC Signature Verification**. Every time the payment gateway sends a webhook saying "Payment Success," my server cryptographically checks the signature to ensure it's actually from Paymob and not a hacker.
*   **Double-Check:** I also added a check to ensure we don't process the same order twice if the webhook is sent multiple times (Idempotency).

### 🚀 Optimizing Images (The "R2" Strategy)
Storing thousands of high-res jersey photos on the main server would be too expensive and slow.
*   **My Solution:** I used **Cloudflare R2** (cheaper than AWS S3, with zero egress fees).
*   **The Trick:** Instead of uploading heavy 5MB images directly, I use a browser-side script (`image-optimizer.ts`) to resize and compress them to **WebP** format *before* they leave the user's device. This reduces a 5MB image to ~200KB (60-80% reduction), saving huge amounts of bandwidth and making uploads instant.
*   **Technical Details**: 
    - Client-side canvas API for image manipulation
    - Automatic resizing to max 1920x1920px while maintaining aspect ratio
    - High-quality image smoothing for better visual results
    - Presigned URLs for direct-to-R2 uploads (no server bottleneck)

### 📦 Docker Deployment
Built a production-ready Docker setup using **Bun runtime** for superior performance:
*   **Multi-stage Build**: Separate builder and runner stages for minimal image size
*   **Bun vs Node**: Bun is significantly faster for both installing dependencies and running the production server
*   **Alpine Linux**: Base image is only ~50MB, reducing deployment time and attack surface
*   **Layer Caching**: Optimized Dockerfile structure for fast rebuilds during development

## 3. Key Features
*   **True RTL Support:** The entire layout flips automatically based on the language. I used Tailwind's logical properties (like `ms-2` instead of `ml-2`) so margins and padding automatically respect the direction.
*   **Admin Dashboard:** I built a custom dashboard where store managers can:
    - Upload products with multi-image support
    - Track orders with real-time status updates
    - Generate sales reports with Recharts visualizations
    - Manage coupons (percentage/fixed discounts, usage limits, expiration)
    - View low stock alerts
*   **Real-time Email:** Using a background worker (BullMQ) to send order confirmation emails without slowing down the checkout response.
*   **Product Variants**: Full support for size and color combinations with independent stock tracking
*   **Coupon System**: Flexible discount system with percentage/fixed amounts, usage limits, and expiration dates
*   **Review System**: Customers can rate and review products after purchase
*   **Wishlist**: Save items for later with one-click add to cart

### ⚡ The HeroUI v3 Migration (Bundle Size Optimization)
When building for production, I noticed the bundle size was larger than necessary. The issue? I was importing components from the monolithic `@heroui/react` package.
*   **The Problem:** Importing from `@heroui/react` pulls in the entire component library, even if you only use a few components. This hurts performance, especially on mobile connections.
*   **The Solution:** HeroUI v3 uses a **modular package architecture**. Instead of `import { Button, Input } from '@heroui/react'`, I now import each component from its specific package: `@heroui/button`, `@heroui/input`, `@heroui/card`.
*   **The Result:** Webpack can now tree-shake unused components, reducing the bundle size. Only the components I actually use get shipped to the browser.
*   **Bonus:** The v3 API also uses cleaner patterns, like `onValueChange` instead of `onChange` for form inputs, which gives you the value directly instead of a synthetic event object.

## 4. The Thinking Process: Technical Deep Dives

### 🔢 Solving the "Decimal" Problem
One of the trickiest bugs I encountered was passing pricing data from the server (Prisma) to the client (React).
*   **The Issue:** Prisma uses a custom `Decimal` type for precision. Next.js Server Components can read this, but when passing it to a Client Component, React fails to serialize it because it's not a native JSON type.
*   **The Fix:** I created a utility to transform data at the boundary. Before passing any product object to a client component, the `price` field is converted to a plain number or string. This ensures the frontend gets clean, usable data without losing the precision usage on the backend.

### 🛡️ Centralized Middleware Architecture
I wanted to keep my authorization and localization logic clean, so I avoided scattering checks across every page.
*   **Proxy Pattern:** I implemented a `proxy.ts` module that acts as the central brain for request handling.
*   **Flow:**
    1.  **i18n First:** The middleware first resolves the locale (Arabic/English).
    2.  **Route Protection:** It then checks if the user is accessing an `/admin` route.
    3.  **Auth Check:** If it's an admin route, it verifies the session token *before* the request even hits the layout.
    This consolidation means I have **one single place** to debug routing logic, rather than juggling three different middleware responsibilities.

### 🔐 Why Better Auth?
I initially considered NextAuth (Auth.js) but switched to **Better Auth 1.4**.
*   **Type Safety:** Better Auth provided superior TypeScript inference out of the box, with full type safety for session data.
*   **Performance:** It felt more lightweight and didn't require as much boilerplate for simple email/password and social login flows.
*   **Control:** It gave me finer control over session management, which was crucial for the "Hybrid Cart" feature where I needed to merge guest sessions with authenticated user sessions.
*   **Modern API**: Cleaner, more intuitive API compared to NextAuth v5

### 🔍 Shareable Search State
For the product listing page, I avoided local state (`useState`) for filters.
*   **URL-Driven State:** Instead, I pushed all search queries, category filters, and sort options directly to the URL parameters.
*   **Debouncing:** I implemented a debounced search input that updates the URL after 300ms of typing.
*   **Benefit:** This means users can share a link like `.../products?search=jersey&sort=price_asc` and the recipient sees *exactly* the same view. It makes the store feel much more professional and accessible.

## 5. What I Learned
This project pushed me to go beyond simple CRUD apps. I learned:
*   How to handle **real-world financial transactions** securely with HMAC verification and idempotency.
*   The complexity of **Server Actions** in Next.js 16 and how to use them for type-safe form submissions.
*   That **user experience** is in the details—like keeping the cart saved even if the user refreshes or switches devices.
*   **Background job processing** with BullMQ for reliable asynchronous tasks.
*   **Docker containerization** for consistent deployments across environments.
*   **Production-ready architecture** with proper error handling, logging, and monitoring.

## 6. Production Metrics
*   **15 Database Models**: Comprehensive schema covering all e-commerce needs
*   **30+ API Endpoints**: RESTful APIs for all features
*   **50+ Components**: Reusable React components with TypeScript
*   **2 Languages**: Full Arabic and English support with RTL
*   **3 Payment Gateways**: Paymob, Kashier, and Stripe integration
*   **Docker Ready**: Production deployment with Bun runtime
*   **Background Workers**: Asynchronous email processing with BullMQ

---
*This project represents my ability to build production-ready full-stack applications that solve actual business needs.*
