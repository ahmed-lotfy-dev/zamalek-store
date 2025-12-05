# Product Requirements Document (PRD) - Zamalek Store

## 1. Introduction

**Zamalek Store** is a digital storefront for a local brick-and-mortar shop in Zamalek. The goal is to expand their reach beyond the physical location and Facebook page, offering a seamless online shopping experience with inventory management, secure payments, and order tracking.

## 2. Goals & Objectives

- **Digital Presence:** Establish a professional website to showcase products.
- **Sales Automation:** Allow customers to browse, add to cart, and purchase items 24/7.
- **Operational Efficiency:** Provide an admin panel for the store owner to manage products, categories, and orders easily.
- **Secure Payments:** Integrate Paymob for reliable local payment processing.

## 3. Target Audience

- **Customers:** Local residents of Zamalek and wider Cairo/Egypt looking for the store's products.
- **Admin/Store Owner:** The business owner who needs a simple tool to manage the online business.

## 4. Key Features

### 4.1 Storefront (Customer View)

- **Homepage:** Featured products, categories, and promotional banners.
- **Product Browsing:** Filter by category, price, and search functionality.
- **Product Details:** High-quality images, descriptions, pricing, and stock status.
- **Shopping Cart:** Add/remove items, adjust quantities, view total cost.
- **Checkout:** Guest or User checkout, address input, Paymob payment integration.
- **User Accounts:** Order history, saved addresses, profile management.

### 4.2 Admin Panel (Owner View)

- **Dashboard:** Overview of sales, recent orders, and low stock alerts.
- **Product Management:** Create, read, update, delete (CRUD) products. Upload images, set prices and stock.
- **Category Management:** Organize products into categories.
- **Order Management:** View order status (Pending, Paid, Shipped, Delivered), print packing slips (optional).
- **Transaction Logs:** View Paymob transaction statuses.

## 5. Technical Requirements

- **Frontend:** Next.js (React), Tailwind CSS for styling.
- **Backend:** Next.js Server Actions / API Routes.
- **Database:** PostgreSQL.
- **ORM:** Prisma.
- **Authentication:** NextAuth.js (Auth.js) for secure login (Email/Password, Socials if needed).
- **Payments:** Paymob API integration.
- **Image Hosting:** Cloudinary or AWS S3 (or similar) for product images.

## 6. Assumptions & Constraints

- The store owner will manually update order statuses.
- Inventory is tracked digitally; synchronization with physical store stock might be manual initially unless a POS integration is requested later.
