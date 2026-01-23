# Zamalek Store 🏪

**A modern, bilingual e-commerce platform for Zamalek SC merchandise**

[![Next.js](https://img.shields.io/badge/Next.js-16.0.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.1-green)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

Zamalek Store is a production-ready e-commerce platform designed for a local brick-and-mortar shop in Zamalek, Cairo. Built with modern technologies and best practices, it provides a seamless shopping experience in both Arabic and English.

## 📸 Visual Showcase

### Home Page - Bilingual Support

<table>
<tr>
<td width="50%">

**English Version**
![Home Page - English](docs/screenshots/home-page-en.png)

</td>
<td width="50%">

**Arabic Version (RTL)**
![Home Page - Arabic](docs/screenshots/home-page-ar.png)

</td>
</tr>
</table>

### Product Browsing & Cart

<table>
<tr>
<td width="50%">

**Products Listing**
![Products Listing](docs/screenshots/products-listing.png)

</td>
<td width="50%">

**Shopping Cart Drawer**
![Cart Drawer](docs/screenshots/cart-drawer.png)

</td>
</tr>
</table>

### Product Details

![Product Detail Page](docs/screenshots/product-detail.png)

> 📚 **More Screenshots:** See [Visual Showcase](docs/screenshots.md) for detailed screenshots and feature highlights.

---

## ✨ Features

### 🛍️ Customer Features

- **Bilingual Support** - Full Arabic and English localization with RTL support
- **Product Browsing** - Browse products by categories with beautiful UI
- **Advanced Search & Filtering** - Find products quickly with filters and search
- **Product Variants** - Select size and color options for products
- **Shopping Cart** - Hybrid cart system (localStorage + database sync)
- **Secure Checkout** - Integrated payment gateways (Paymob & Kashier)
- **User Accounts** - Sign up, login, and manage your profile
- **Order Tracking** - Track your orders from purchase to delivery
- **Product Reviews** - Read and write product reviews
- **Wishlist** - Save items for later
- **Newsletter** - Subscribe to stay updated

### 👨‍💼 Admin Features

- **Dashboard** - Sales analytics, charts, and key metrics
- **Product Management** - CRUD operations with image upload
- **Category Management** - Organize products into categories
- **Order Management** - Track and update order statuses
- **Coupon System** - Create and manage discount coupons
- **User Management** - View and manage customer accounts
- **Image Optimization** - Automatic image compression and WebP conversion
- **Analytics** - Sales reports and customer insights

---

## 🚀 Tech Stack

### Frontend

- **[Next.js 16.0.6](https://nextjs.org/)** - React framework with App Router
- **[React 19.2](https://react.dev/)** - Latest UI library
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4.1](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components (Avatar, Dialog, Dropdown, Select, etc.)
- **[next-intl 4.5](https://next-intl-docs.vercel.app/)** - Internationalization
- **[Framer Motion 12](https://www.framer.com/motion/)** - Animations
- **[Recharts 3.5](https://recharts.org/)** - Charts for analytics
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend

- **[PostgreSQL](https://www.postgresql.org/)** - Relational database with Prisma adapter
- **[Prisma 7.1](https://www.prisma.io/)** - Type-safe ORM with migrations
- **[Better Auth 1.4](https://better-auth.com/)** - Modern authentication library
- **[BullMQ 5.65](https://docs.bullmq.io/)** - Redis-based job queue for background tasks
- **[Socket.IO 4.8](https://socket.io/)** - Real-time bidirectional communication
- **[Nodemailer 6.10](https://nodemailer.com/)** - Email sending
- **[Zod 4.1](https://zod.dev/)** - Schema validation

### Infrastructure

- **[Cloudflare R2](https://www.cloudflare.com/products/r2/)** - Object storage (S3-compatible) for images
- **[Redis](https://redis.io/)** - Caching and queue management (IORedis 5.8)
- **[Mailtrap](https://mailtrap.io/)** - Email testing and delivery
- **[Docker](https://www.docker.com/)** - Containerization with Bun runtime
- **[AWS SDK](https://aws.amazon.com/sdk-for-javascript/)** - S3 client for R2 integration

### Payment Gateways

- **[Paymob](https://paymob.com/)** - Egyptian payment gateway (cards, wallets)
- **[Kashier](https://kashier.io/)** - Alternative payment provider
- **[Stripe](https://stripe.com/)** - International payment processing (ready for future expansion)

---

## 📦 Key Features in Detail

### 🖼️ Image Upload & Optimization

Automatic image optimization before upload:

- **60-80% file size reduction** through compression
- **WebP conversion** for modern browsers
- **Automatic resizing** to optimal dimensions (max 1920x1920)
- **Direct R2 upload** using presigned URLs (scalable)
- **Progress tracking** for better UX

### 🌍 Internationalization

Full bilingual support:

- **Arabic & English** with seamless switching
- **RTL layout** for Arabic
- **Database-level translations** for products and categories
- **Locale-aware routing** (`/ar/products`, `/en/products`)

### 🛒 Hybrid Cart System

Smart cart management:

- **Guest users**: Cart stored in localStorage
- **Logged-in users**: Cart synced to database
- **Auto-merge**: Guest cart merges with user cart on login
- **Persistent**: Cart survives page refreshes and sessions

### 💳 Payment Integration

Dual payment gateway support:

- **Paymob**: Card payments, mobile wallets
- **Kashier**: Alternative payment methods
- **HMAC verification**: Secure webhook handling
- **Idempotency**: Prevents duplicate charges

### 📊 Admin Dashboard

Comprehensive admin panel:

- **Sales analytics** with charts (Recharts)
- **Recent orders** overview
- **Low stock alerts**
- **Revenue tracking**
- **Customer insights**

---

## 🏗️ Project Structure

```
zamalek-store/
├── app/
│   ├── [locale]/              # Internationalized routes
│   │   ├── (store)/          # Customer-facing pages
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── products/     # Product listing & details
│   │   │   ├── cart/         # Shopping cart
│   │   │   ├── checkout/     # Checkout flow
│   │   │   └── profile/      # User profile
│   │   └── admin/            # Admin panel
│   │       ├── page.tsx      # Dashboard
│   │       ├── products/     # Product management
│   │       ├── categories/   # Category management
│   │       ├── orders/       # Order management
│   │       └── coupons/      # Coupon management
│   ├── lib/
│   │   ├── actions/          # Server actions
│   │   ├── auth.ts           # Authentication config
│   │   ├── prisma.ts         # Database client
│   │   ├── r2.ts             # R2 storage client
│   │   └── image-optimizer.ts # Image optimization
│   └── api/                  # API routes
├── components/
│   ├── admin/            # Admin components
│   └── store/            # Store components
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Database seeding
│   └── seed-data.ts          # Seed data
├── public/                   # Static assets
├── messages/                 # i18n translations
│   ├── ar.json               # Arabic translations
│   └── en.json               # English translations
└── docs/                     # Documentation
    ├── r2-cors-setup.md
    ├── paymob-integration.md
    ├── deployment.md
    └── developer-assessment.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ or 22+ or 24+
- **PostgreSQL** database
- **Redis** server
- **Cloudflare R2** account (for image storage)
- **Paymob/Kashier** account (for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ahmed-lotfy-dev/zamalek-store.git
   cd zamalek-store
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/zamalek_store"

   # Authentication
   AUTH_SECRET="your_auth_secret"  # Generate with: npx auth secret
   BETTER_AUTH_URL="http://localhost:3000"

   # Cloudflare R2
   R2_ACCOUNT_ID="your_r2_account_id"
   R2_ACCESS_KEY_ID="your_r2_access_key"
   R2_SECRET_ACCESS_KEY="your_r2_secret_key"
   R2_BUCKET_NAME="your_bucket_name"
   R2_PUBLIC_URL="https://your-bucket.r2.dev"

   # Paymob
   PAYMOB_API_KEY="your_paymob_api_key"
   PAYMOB_IFRAME_ID="your_iframe_id"
   PAYMOB_INTEGRATION_ID="your_integration_id"
   PAYMOB_HMAC_SECRET="your_hmac_secret"

   # Kashier
   KASHIER_API_KEY="your_kashier_api_key"
   KASHIER_MID="your_merchant_id"

   # Email (Mailtrap)
   MAILTRAP_HOST="smtp.mailtrap.io"
   MAILTRAP_PORT="2525"
   MAILTRAP_USER="your_mailtrap_user"
   MAILTRAP_PASS="your_mailtrap_pass"
   MAILTRAP_SENDER_EMAIL="noreply@zamalekstore.com"

   # Redis
   REDIS_URL="redis://localhost:6379"
   ```

4. **Initialize the database**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Seed the database** (optional)

   ```bash
   npm run seed
   ```

6. **Configure R2 CORS**

   Follow the guide in [`docs/r2-cors-setup.md`](docs/r2-cors-setup.md)

7. **Run the development server**

   ```bash
   npm run dev
   ```

8. **Run the email worker** (in a separate terminal)

   ```bash
   npm run worker
   ```

9. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

- **[R2 CORS Setup](docs/r2-cors-setup.md)** - Configure Cloudflare R2 for image uploads
- **[Paymob Integration](docs/paymob-integration.md)** - Payment gateway setup
- **[Deployment Guide](docs/deployment.md)** - Deploy to production
- **[Database Design](docs/database_design.md)** - Database schema documentation
- **[Developer Assessment](docs/developer-assessment.md)** - Project review and analysis

---

## 🗄️ Database Schema

### Core Models

- **User** - Customer accounts with roles (USER, ADMIN, VIEWER)
- **Product** - Products with variants, images, and translations
- **ProductVariant** - Size and color combinations with stock
- **Category** - Product categories with images
- **Cart** - User shopping carts
- **CartItem** - Items in cart
- **Order** - Customer orders with status tracking
- **OrderItem** - Products in orders
- **Payment** - Payment records with transaction IDs
- **Review** - Product reviews and ratings
- **SavedItem** - Wishlist items
- **Coupon** - Discount coupons
- **Subscription** - Newsletter subscriptions

See [`docs/database_design.md`](docs/database_design.md) for detailed schema.

---

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Dark Mode** - Light and dark themes
- **Smooth Animations** - Framer Motion animations
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback
- **Optimistic Updates** - Instant UI updates

---

## 🔒 Security Features

- **Authentication** - Secure session-based auth with Better Auth
- **Authorization** - Role-based access control (RBAC)
- **HMAC Verification** - Webhook signature verification
- **Input Validation** - Server-side validation
- **CORS Protection** - Configured CORS policies
- **SQL Injection Prevention** - Prisma ORM protection
- **XSS Protection** - React's built-in XSS prevention

---

## 🚀 Performance Optimizations

- **Image Optimization** - Automatic WebP conversion and compression
- **Code Splitting** - Dynamic imports for faster loads
- **Server Components** - React Server Components for better performance
- **Caching** - Redis caching for frequently accessed data
- **Database Indexing** - Optimized database queries
- **CDN** - Static assets served from CDN
- **Radix UI Components** - Lightweight, accessible headless components

### Background Worker Architecture

The application uses **BullMQ** with Redis for reliable background job processing:

**Email Queue System:**
- **Asynchronous Processing**: Email sending doesn't block HTTP responses
- **Retry Logic**: Failed jobs retry with exponential backoff (3 attempts)
- **Job Types**: Order confirmations, status updates, welcome emails
- **Monitoring**: Job completion and failure tracking

**Worker Process** (`worker.ts`):
```bash
npm run worker  # Runs separately from main app
```

**Benefits:**
- **Faster Response Times**: Checkout completes instantly
- **Reliability**: Jobs persist in Redis if worker crashes
- **Scalability**: Multiple workers can process jobs in parallel

---

### Docker Deployment

Production-ready Docker setup with **Bun runtime** for optimal performance:

**Multi-stage Build:**
1. **Builder Stage**: Installs dependencies, generates Prisma client, builds Next.js
2. **Runner Stage**: Minimal production image with only necessary files

**Key Features:**
- **Bun Runtime**: Faster than Node.js for both build and runtime
- **Alpine Linux**: Minimal base image (~50MB)
- **Layer Caching**: Optimized for fast rebuilds
- **Environment Variables**: Configured via `.env` or Docker Compose

**Deployment:**
```bash
docker build -t zamalek-store .
docker run -p 3000:3000 zamalek-store
```

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 📦 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Setup

1. Set up PostgreSQL database
2. Set up Redis server
3. Configure environment variables
4. Run database migrations
5. Start the application
6. Start the worker process

See [`docs/deployment.md`](docs/deployment.md) for detailed deployment instructions.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run worker       # Start email worker
npm run socket       # Start socket server (if needed)
```

---

## 🐛 Known Issues

- CORS must be configured on R2 bucket for image uploads to work
- Email worker must be running separately for email notifications
- Redis must be running for queue functionality

---

## 🔮 Future Enhancements

- [ ] Product search with Algolia/Elasticsearch
- [ ] Real-time inventory updates with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Social media integration
- [ ] Product recommendations
- [ ] Multi-vendor support
- [ ] Loyalty program

---

## 📄 License

This project is private and proprietary.

---

## 👨‍💻 Developer

**Ahmed Lotfy**

- GitHub: [@ahmed-lotfy-dev](https://github.com/ahmed-lotfy-dev)
- Email: elshenawy19@gmail.com

---

## 🙏 Acknowledgments

- **Zamalek SC** - For the inspiration
- **Next.js Team** - For the amazing framework
- **Vercel** - For hosting and deployment tools
- **Cloudflare** - For R2 storage
- **Prisma** - For the excellent ORM

---

## 📊 Project Stats

- **Lines of Code**: ~10,000+
- **Components**: 50+
- **Database Models**: 15
- **API Endpoints**: 30+
- **Languages**: 2 (Arabic, English)
- **Payment Providers**: 2 (Paymob, Kashier)

---

**Built with ❤️ for Zamalek SC fans**
