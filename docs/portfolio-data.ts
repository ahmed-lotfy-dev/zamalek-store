export const zamalekStoreProject = {
  basicInfo: {
    titleEn: "Zamalek Store",
    titleAr: "متجر الزمالك",
    slug: "zamalek-store",
  },
  shortDescription: {
    en: "A production-ready, bilingual e-commerce platform for Zamalek SC merchandise. Built with Next.js 16, featuring dual payment gateways (Paymob/Kashier), background job processing with BullMQ, Docker deployment, and comprehensive admin dashboard. Optimized for the Egyptian market with RTL support and local payment integration.",
    ar: "متجر إلكتروني احترافي وثنائي اللغة لمنتجات نادي الزمالك. مبني باستخدام Next.js 16، يتضمن بوابتي دفع (Paymob/Kashier)، معالجة مهام خلفية مع BullMQ، نشر عبر Docker، ولوحة تحكم شاملة. محسّن للسوق المصري مع دعم كامل للغة العربية والمدفوعات المحلية.",
  },
  caseStudy: {
    en: `# Case Study: Zamalek Store
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
*   **PostgreSQL with Prisma 7.1**: I designed a comprehensive schema with 15 models to handle all aspects of the e-commerce platform. The schema handles bilingual data natively (e.g., \`name_ar\` and \`name_en\` columns) so I don't rely on fragile JSON files for product data.
*   **Type Safety**: Prisma provides end-to-end type safety from database to UI, catching errors at compile time.
*   **Migrations**: All schema changes are versioned and tracked through Prisma migrations.

### State Management
I built a **hybrid cart system** that adapts to user authentication status:
*   **Guest users**: Cart stored in \`localStorage\` for instant performance
*   **Logged-in users**: Cart synced to PostgreSQL database
*   **Auto-merge**: When guests log in, their local cart automatically merges with their database cart, ensuring no "lost" items during signup
*   **Persistence**: Cart survives page refreshes, browser restarts, and device switches (for authenticated users)

### Background Job Processing
Implemented **BullMQ with Redis** for reliable asynchronous task processing:
*   **Email Queue**: Order confirmations, status updates, and welcome emails processed in background
*   **Retry Logic**: Failed jobs automatically retry with exponential backoff (3 attempts)
*   **Worker Process**: Separate \`worker.ts\` process handles jobs independently from the main application
*   **Benefits**: Checkout responses are instant (~200ms), even though emails are being sent

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
*   **True RTL Support:** The entire layout flips automatically based on the language. I used Tailwind's logical properties (like \`ms-2\` instead of \`ml-2\`) so margins and padding automatically respect the direction.
*   **Admin Dashboard:** I built a custom dashboard where store managers can upload products, track orders, and generate sales reports.
*   **Real-time Email:** Using a background worker (BullMQ) to send order confirmation emails without slowing down the checkout response.
*   **Product Variants**: Full support for size and color combinations with independent stock tracking
*   **Coupon System**: Flexible discount system with percentage/fixed amounts, usage limits, and expiration dates
*   **Review System**: Customers can rate and review products after purchase
*   **Wishlist**: Save items for later with one-click add to cart

### ⚡ UI Component Architecture (Shadcn + Radix UI)
I chose **Shadcn UI** with **Radix UI** primitives for the component library instead of a monolithic UI framework.
*   **The Approach:** Shadcn provides beautifully designed components that you copy into your project, built on top of Radix UI's accessible, unstyled primitives.
*   **Why This Matters:** 
    - **Full Control**: Components live in your codebase, so you can customize them completely
    - **No Bundle Bloat**: Only the components you use are in your bundle
    - **Accessibility First**: Radix UI handles complex accessibility patterns (keyboard navigation, ARIA attributes, focus management)
    - **Type Safety**: Full TypeScript support with proper prop types
*   **Components Used**: Avatar, Dialog, Dropdown Menu, Select, Checkbox, Radio Group, Tabs, Tooltip, Scroll Area, and more
*   **The Result:** A polished, accessible UI without the overhead of a full component library. Perfect balance of developer experience and performance.

## 4. The Thinking Process: Technical Deep Dives

### 🔢 Solving the "Decimal" Problem
One of the trickiest bugs I encountered was passing pricing data from the server (Prisma) to the client (React).
*   **The Issue:** Prisma uses a custom \`Decimal\` type for precision. Next.js Server Components can read this, but when passing it to a Client Component, React fails to serialize it because it's not a native JSON type.
*   **The Fix:** I created a utility to transform data at the boundary. Before passing any product object to a client component, the \`price\` field is converted to a plain number or string. This ensures the frontend gets clean, usable data without losing the precision usage on the backend.

### 🛡️ Centralized Middleware Architecture
I wanted to keep my authorization and localization logic clean, so I avoided scattering checks across every page.
*   **Proxy Pattern:** I implemented a \`proxy.ts\` module that acts as the central brain for request handling.
*   **Flow:**
    1.  **i18n First:** The middleware first resolves the locale (Arabic/English).
    2.  **Route Protection:** It then checks if the user is accessing an \`/admin\` route.
    3.  **Auth Check:** If it's an admin route, it verifies the session token *before* the request even hits the layout.
    This consolidation means I have **one single place** to debug routing logic, rather than juggling three different middleware responsibilities.

### 🔐 Why Better Auth?
I initially considered NextAuth (Auth.js) but switched to **Better Auth**.
*   **Type Safety:** Better Auth provided superior TypeScript inference out of the box.
*   **Performance:** It felt more lightweight and didn't require as much boilerplate for simple email/password and social login flows.
*   **Control:** It gave me finer control over session management, which was crucial for the "Hybrid Cart" feature where I needed to merge guest sessions with authenticated user sessions.

### 🔍 Shareable Search State
For the product listing page, I avoided local state (\`useState\`) for filters.
*   **URL-Driven State:** Instead, I pushed all search queries, category filters, and sort options directly to the URL parameters.
*   **Debouncing:** I implemented a debounced search input that updates the URL after 300ms of typing.
*   **Benefit:** This means users can share a link like \`.../products?search=jersey&sort=price_asc\` and the recipient sees *exactly* the same view. It makes the store feel much more professional and accessible.

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
`,
    ar: `# دراسة حالة: متجر الزمالك
**بناء منصة تجارة إلكترونية ثنائية اللغة للسوق المصري**

> **الدور:** مطور واجهة كاملة (Full-Stack Developer)
> **التقنيات المستخدمة:** Next.js 15, React 19, TypeScript, PostgreSQL, Prisma, Paymob/Kashier
> **المعاينة الحية:** [zamalek-store.ahmedlotfy.site](https://zamalek-store.ahmedlotfy.site)

---

## التحدي
بناء متجر إلكتروني لمشجعي **نادي الزمالك** كان يعني أكثر من مجرد عرض المنتجات. كان عليّ حل ثلاثة تحديات محددة تتعلق بالسوق المصري:
1. **التعريب (Localization):** يجب أن يعمل المتجر بسلاسة باللغتين العربية (من اليمين لليسار) والإنجليزية.
2. **المدفوعات المحلية:** قبول المدفوعات المحلية (Paymob & Kashier) بشكل موثوق.
3. **الأداء:** صور المنتجات ثقيلة، لكن الموقع يحتاج إلى سرعة تحميل عالية حتى على بيانات الهاتف.

## 1. الهيكلية التقنية
اخترت **Next.js 16 (App Router)** لأنه يسمح بنقل المنطق الثقيل إلى الخادم والاستفادة من مكونات React Server للأداء الأمثل.

### قاعدة البيانات والـ ORM
*   **PostgreSQL مع Prisma 7.1**: صممت مخططاً شاملاً يحتوي على 15 نموذجاً للتعامل مع جميع جوانب المنصة. يتعامل المخطط مع البيانات ثنائية اللغة محلياً (مثل أعمدة \`name_ar\` و \`name_en\`).
*   **أمان الأنواع**: يوفر Prisma أماناً شاملاً للأنواع من قاعدة البيانات إلى واجهة المستخدم.
*   **الترحيلات**: جميع تغييرات المخطط مُصنّفة ومُتتبّعة عبر ترحيلات Prisma.

### إدارة الحالة
قمت ببناء **نظام سلة هجين** يتكيف مع حالة مصادقة المستخدم:
*   **الزوار**: السلة محفوظة في \`localStorage\` للأداء الفوري
*   **المستخدمون المسجلون**: السلة متزامنة مع قاعدة بيانات PostgreSQL
*   **الدمج التلقائي**: عند تسجيل دخول الزوار، تندمج سلتهم المحلية تلقائياً مع سلة قاعدة البيانات
*   **الاستمرارية**: تبقى السلة حتى بعد تحديث الصفحة أو تبديل الأجهزة

### معالجة المهام الخلفية
نفذت **BullMQ مع Redis** لمعالجة المهام غير المتزامنة بشكل موثوق:
*   **قائمة انتظار البريد**: تأكيدات الطلبات وتحديثات الحالة تُعالج في الخلفية
*   **منطق إعادة المحاولة**: المهام الفاشلة تُعاد تلقائياً مع تأخير أسّي (3 محاولات)
*   **عملية العامل**: عملية \`worker.ts\` منفصلة تتعامل مع المهام بشكل مستقل
*   **الفوائد**: استجابات الدفع فورية (~200 ميلي ثانية)، حتى أثناء إرسال البريد

## 2. حل مشاكل حقيقية

### 💳 صراع دمج بوابات الدفع
كان دمج بوابات الدفع المصرية مثل Paymob هو الجزء الأصعب. التوثيق قد يكون معقداً، والـ Webhooks تفشل أحياناً.
*   **الحل:** قمت بتنفيذ **التحقق من التوقيع (HMAC Signature Verification)**. في كل مرة ترسل فيها بوابة الدفع إشعاراً بنجاح الدفع، يقوم الخادم بالتحقق من التوقيع للتأكد من أنه قادم من Paymob فعلاً وليس من مخترق.
*   **تحقق مزدوج:** أضفت أيضاً تحققاً لضمان عدم معالجة نفس الطلب مرتين (Idempotency) إذا تم إرسال الـ Webhook عدة مرات.

### 🚀 تحسين الصور (استراتيجية R2)
تخزين آلاف الصور عالية الدقة سيكون مكلفاً وبطئياً.
*   **حلي:** استخدمت **Cloudflare R2** (أرخص من AWS S3).
*   **الحيلة:** بدلاً من رفع صور بحجم 5 ميجابايت مباشرة، أستخدم سكربت في المتصفح لتغيير حجمها وضغطها إلى صيغة **WebP** *قبل* أن تغادر جهاز المستخدم. هذا يقلل الصورة من 5 ميجابايت إلى حوالي 200 كيلوبايت، مما يوفر استهلاك الباقة وبجعل الرفع فورياً.

## 3. المميزات الرئيسية
*   **دعم حقيقي للغة العربية (RTL):** ينقلب التخطيط بالكامل تلقائياً بناءً على اللغة. استخدمت خصائص Tailwind المنطقية (مثل \`ms-2\` بدلاً من \`ml-2\`) لضمان احترام الاتجاهات تلقائياً.
*   **لوحة تحكم المشرف:** قمت ببناء لوحة تحكم مخصصة يمكن لمديري المتجر من خلالها رفع المنتجات، تتبع الطلبات، وإنشاء تقارير المبيعات.
*   **بريد إلكتروني فوري:** استخدام معالج خلفية (BullMQ) لإرسال رسائل تأكيد الطلب دون إبطاء استجابة الدفع.

### ⚡ الترحيل إلى HeroUI v3 (تحسين حجم الحزمة)
عند البناء للإنتاج، لاحظت أن حجم الحزمة كان أكبر من اللازم. السبب؟ كنت أستورد المكونات من حزمة \`@heroui/react\` الكبيرة.
*   **المشكلة:** الاستيراد من \`@heroui/react\` يسحب مكتبة المكونات بالكامل حتى لو استخدمت مكونات قليلة. هذا يضر بالأداء.
*   **الحل:** HeroUI v3 يستخدم **هيكلية حزم معيارية**. بدلاً من الاستيراد العام، أصبحت أستورد كل مكون من حزمته الخاصة.
*   **النتيجة:** يمكن لـ Webpack الآن استبعاد المكونات غير المستخدمة (tree-shake)، مما يقلل حجم الحزمة بشكل كبير.

## 4. عملية التفكير: نقاشات تقنية عميقة

### 🔢 حل مشكلة "الأرقام العشرية"
واحدة من أصعب الأخطاء كانت تمرير بيانات الأسعار من الخادم (Prisma) إلى العميل (React).
*   **المشكلة:** Prisma تستخدم نوع \`Decimal\` للدقة. مكونات الخادم تقرؤه، ولكن عند تمريره لمكون العميل، يفشل React في قراءته لأنه ليس نوع JSON أصلي.
*   **الحل:** أنشأت أداة لتحويل البيانات عند الحدود الفاصلة. قبل تمرير أي منتج، يتم تحويل حقل السعر إلى رقم عادي أو نص، لضمان وصول بيانات نظيفة للواجهة الأمامية.

### 🛡️ هندسة البرمجيات الوسيطة المركزية (Middleware)
أردت الحفاظ على نظافة منطق التحقق والتوثيق.
*   **نمط الوكيل (Proxy Pattern):** نفذت وحدة \`proxy.ts\` تعمل كعقل مدبر لمعالجة الطلبات.
*   **التدفق:** تحدد اللغة أولاً، ثم تتحقق من المسار، ثم تتحقق من صلاحيات المدير قبل الوصول للصفحة. هذا يعني مكاناً واحداً لتنقيح أخطاء التوجيه.

## 5. ماذا تعلمت
دفعني هذا المشروع لتجاوز تطبيقات CRUD البسيطة. تعلمت:
*   كيفية التعامل مع **المعاملات المالية الحقيقية** بأمان مع التحقق من HMAC وعدم التكرار.
*   تعقيد **Server Actions** في Next.js 16 وكيفية استخدامها لتقديم النماذج بأمان.
*   أن **تجربة المستخدم** تكمن في التفاصيل - مثل الحفاظ على السلة حتى لو قام المستخدم بتحديث الصفحة.
*   **معالجة المهام الخلفية** مع BullMQ للمهام غير المتزامنة الموثوقة.
*   **الحاويات Docker** للنشر المتسق عبر البيئات.
*   **البنية الجاهزة للإنتاج** مع معالجة الأخطاء والتسجيل والمراقبة المناسبة.

## 6. مقاييس الإنتاج
*   **15 نموذج قاعدة بيانات**: مخطط شامل يغطي جميع احتياجات التجارة الإلكترونية
*   **30+ نقطة API**: واجهات برمجية لجميع الميزات
*   **50+ مكون**: مكونات React قابلة لإعادة الاستخدام مع TypeScript
*   **لغتان**: دعم كامل للعربية والإنجليزية مع RTL
*   **3 بوابات دفع**: تكامل Paymob و Kashier و Stripe
*   **جاهز لـ Docker**: نشر الإنتاج مع Bun runtime
*   **عمال الخلفية**: معالجة البريد الإلكتروني غير المتزامنة مع BullMQ
`,
  },
  mediaMetadata: {
    categories: [
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "TailwindCSS",
      "Redis",
      "BullMQ",
      "Docker",
      "E-Commerce",
    ],
    published: true,
    repoLink: "https://github.com/ahmed-lotfy-dev/zamalek-store",
    liveLink: "https://zamalek-store.ahmedlotfy.site",
    coverImage: "docs/screenshots/home-page-en.png",
  },
};

