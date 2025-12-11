# Case Study: Zamalek Store
**Building a Bilingual E-Commerce Platform for the Egyptian Market**

> **Role:** Full-Stack Developer
> **Tech Stack:** Next.js 15, React 19, TypeScript, PostgreSQL, Prisma, Paymob/Kashier
> **Live Demo:** [zamalek-store.ahmedlotfy.site](https://zamalek-store.ahmedlotfy.site)

---

## The Challenge
Building an e-commerce store for **Zamalek SC** fans meant more than just listing products. I needed to solve three specific challenges relevant to the Egyptian market:
1. **Localization:** It had to work seamlessly in both Arabic (RTL) and English (LTR).
2. **Local Payments:** It needed to accept local payments (Paymob & Kashier) reliably.
3. **Performance:** Merchandise photos are heavy, but the site needed to load fast on mobile data.

## 1. Technical Architecture
I chose **Next.js 15 (App Router)** because it allows me to move heavy logic to the server.
*   **Database:** Used **PostgreSQL** with **Prisma ORM**. I designed the schema to handle bilingual data natively (e.g., `name_ar` and `name_en` columns) so I don't rely on fragile JSON files for product data.
*   **State Management:** I built a **hybrid cart system**. Guest users store items in `localStorage` for speed. When they log in, I automatically merge their local items with their database cart, ensuring no "lost" items during signup.

## 2. Solving Real Problems

### 💳 The Payment Integration Struggle
Integrating Egyptian gateways like Paymob was the hardest part. The documentation can be tricky, and webhooks sometimes fail.
*   **The Fix:** I implemented **HMAC Signature Verification**. Every time the payment gateway sends a webhook saying "Payment Success," my server cryptographically checks the signature to ensure it's actually from Paymob and not a hacker.
*   **Double-Check:** I also added a check to ensure we don't process the same order twice if the webhook is sent multiple times (Idempotency).

### 🚀 Optimizing Images (The "R2" Strategy)
Storing thousands of high-res jersey photos on the main server would be too expensive and slow.
*   **My Solution:** I used **Cloudflare R2** (cheaper than AWS S3).
*   **The Trick:** Instead of uploading heavy 5MB images directly, I use a browser script to resize and compress them to **WebP** format *before* they leave the user's device. This reduces a 5MB image to ~200KB, saving huge amounts of bandwidth and making uploads instant.

## 3. Key Features
*   **True RTL Support:** The entire layout flips automatically based on the language. I used Tailwind's logical properties (like `ms-2` instead of `ml-2`) so margins and padding automatically respect the direction.
*   **Admin Dashboard:** I built a custom dashboard where store managers can upload products, track orders, and generate sales reports.
*   **Real-time Email:** Using a background worker (BullMQ) to send order confirmation emails without slowing down the checkout response.

## 4. What I Learned
This project pushed me to go beyond simple CRUD apps. I learned:
*   How to handle **real-world financial transactions** securely.
*   The complexity of **Server Actions** in Next.js 15 and how to use them for type-safe form submissions.
*   That **user experience** is in the details—like keeping the cart saved even if the user refreshes or switches devices.

---
*This project represents my ability to build production-ready full-stack applications that solve actual business needs.*
