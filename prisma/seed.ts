import { prisma } from "../app/lib/prisma";
import { auth } from "../app/lib/auth";
import { Role } from "@prisma/client";
import {
  categoriesData,
  productsData,
  usersData,
  commentsData,
  subscribersData,
} from "./seed-data";

async function main() {
  console.log("Start seeding...");

  // 1. Cleanup
  console.log("Cleaning up database...");
  await prisma.subscription.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.savedItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  // We don't delete users to avoid breaking auth, but we'll ensure admin/test users exist

  // 2. Create Categories
  console.log("Creating categories...");
  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.nameEn] = created.id;
  }

  // 3. Create Products
  console.log("Creating products...");
  const createdProducts = [];
  for (const p of productsData) {
    const { categoryNameEn, ...productData } = p;
    const product = await prisma.product.create({
      data: {
        ...productData,
        categoryId: categories[categoryNameEn],
      },
    });
    createdProducts.push(product);

    // Create Variants
    const sizes = ["S", "M", "L", "XL"];
    const colors = ["White", "Red", "Black"];

    let totalStock = 0;
    for (const size of sizes) {
      for (const color of colors) {
        // Random stock between 0 and 20
        const stock = Math.floor(Math.random() * 21);
        if (stock > 0) {
          totalStock += stock;
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              size,
              color,
              stock,
            },
          });
        }
      }
    }

    // Update product stock with total variant stock
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: totalStock },
    });
  }

  // 4. Create Users & Reviews
  console.log("Creating users and reviews...");
  const createdUsers = [];
  for (const u of usersData) {
    // Check if exists first
    let user = await prisma.user.findUnique({ where: { email: u.email } });
    if (!user) {
      // Create with dummy password logic if needed, or just DB entry
      // Using auth.api.signUpEmail is better if we want them login-able,
      // but for seeding data purely for display, direct DB create is faster/easier if auth allows.
      // We'll try direct DB create for speed, assuming they don't need to login immediately.
      user = await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          emailVerified: true,
          role: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
    createdUsers.push(user);
  }

  // Add reviews
  for (const product of createdProducts) {
    // Add 2-4 reviews per product
    const reviewCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < reviewCount; i++) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomComment =
        commentsData[Math.floor(Math.random() * commentsData.length)];
      const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars mostly

      await prisma.review.create({
        data: {
          userId: randomUser.id,
          productId: product.id,
          rating,
          comment: randomComment,
        },
      });
    }
  }

  // 5. Create Coupons
  console.log("Creating coupons...");
  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      amount: 10,
      isActive: true,
    },
  });
  await prisma.coupon.create({
    data: {
      code: "ZAMALEK20",
      type: "PERCENTAGE",
      amount: 20,
      isActive: true,
    },
  });

  // 6. Create Subscriptions
  console.log("Creating subscriptions...");
  for (const email of subscribersData) {
    await prisma.subscription.create({
      data: { email },
    });
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
