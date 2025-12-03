import { prisma } from "../app/lib/prisma";
import { auth } from "../app/lib/auth";

async function main() {
  console.log("Start seeding...");

  // Cleanup existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create Categories
  const jerseys = await prisma.category.create({
    data: { name: "Jerseys" },
  });

  const tshirts = await prisma.category.create({
    data: { name: "T-Shirts" },
  });

  const accessories = await prisma.category.create({
    data: { name: "Accessories" },
  });

  // Create Admin User
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    try {
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: "Admin User",
        },
        headers: new Headers(),
      });
      console.log(`Created admin user: ${adminEmail}`);
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
  } else {
    console.warn(
      "ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin user creation."
    );
  }

  // Create Products
  // Create Products
  // 1. Home Jersey
  const homeJersey = await prisma.product.create({
    data: {
      name: "Zamalek SC Home Jersey 24/25",
      description:
        "The official home jersey of Zamalek SC. Features the iconic full white design with two bold red lines across the chest, representing the club's rich history and identity. Made with breathable fabric for maximum comfort.",
      price: 59.99,
      stock: 100,
      categoryId: jerseys.id,
      images: [
        "https://placehold.co/600x800/white/red?text=Zamalek+Home+Jersey",
      ],
      isFeatured: true,
    },
  });

  // 2. Away Jersey
  const awayJersey = await prisma.product.create({
    data: {
      name: "Zamalek SC Away Jersey 24/25",
      description:
        "The official away jersey. A sleek black design with white accents, perfect for showing your support on the road.",
      price: 59.99,
      stock: 80,
      categoryId: jerseys.id,
      images: [
        "https://placehold.co/600x800/black/white?text=Zamalek+Away+Jersey",
      ],
    },
  });

  // 3. 1911 Legacy T-Shirt
  const legacyTee = await prisma.product.create({
    data: {
      name: "1911 Legacy T-Shirt",
      description:
        "Celebrate the founding year of the Royal Club. Premium cotton t-shirt with a vintage 1911 print.",
      price: 29.99,
      stock: 150,
      categoryId: tshirts.id,
      images: ["https://placehold.co/600x800/white/black?text=1911+Legacy"],
    },
  });

  // 4. White Knights T-Shirt
  const wkTee = await prisma.product.create({
    data: {
      name: "White Knights Fan Tee",
      description:
        "For the true fans. 'White Knights' graphic print on a comfortable white tee.",
      price: 24.99,
      stock: 200,
      categoryId: tshirts.id,
      images: ["https://placehold.co/600x800/white/red?text=White+Knights"],
    },
  });

  // 5. Zamalek Scarf
  const scarf = await prisma.product.create({
    data: {
      name: "Classic Zamalek Scarf",
      description:
        "Keep warm and show your colors. Classic bar scarf in white and red.",
      price: 19.99,
      stock: 50,
      categoryId: accessories.id,
      images: ["https://placehold.co/600x400/red/white?text=Zamalek+Scarf"],
    },
  });

  // Create Orders
  const user = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (user) {
    // Order 1: PENDING
    await prisma.order.create({
      data: {
        userId: user.id,
        status: "PENDING",
        total: 89.98,
        address: "123 Zamalek St, Cairo, Egypt",
        phone: "+201234567890",
        orderItems: {
          create: [
            {
              productId: homeJersey.id,
              quantity: 1,
              price: 59.99,
            },
            {
              productId: legacyTee.id,
              quantity: 1,
              price: 29.99,
            },
          ],
        },
      },
    });

    // Order 2: PAID
    await prisma.order.create({
      data: {
        userId: user.id,
        status: "PAID",
        total: 59.99,
        isPaid: true,
        address: "456 Mohandessin, Giza, Egypt",
        phone: "+201098765432",
        orderItems: {
          create: [
            {
              productId: awayJersey.id,
              quantity: 1,
              price: 59.99,
            },
          ],
        },
      },
    });

    // Order 3: SHIPPED
    await prisma.order.create({
      data: {
        userId: user.id,
        status: "SHIPPED",
        total: 49.98,
        isPaid: true,
        address: "789 Dokki, Giza, Egypt",
        phone: "+201122334455",
        orderItems: {
          create: [
            {
              productId: wkTee.id,
              quantity: 2,
              price: 24.99,
            },
          ],
        },
      },
    });

    // Order 4: DELIVERED
    await prisma.order.create({
      data: {
        userId: user.id,
        status: "DELIVERED",
        total: 19.99,
        isPaid: true,
        address: "321 Maadi, Cairo, Egypt",
        phone: "+201555666777",
        orderItems: {
          create: [
            {
              productId: scarf.id,
              quantity: 1,
              price: 19.99,
            },
          ],
        },
      },
    });

    // Order 5: CANCELLED
    await prisma.order.create({
      data: {
        userId: user.id,
        status: "CANCELLED",
        total: 119.98,
        address: "654 Heliopolis, Cairo, Egypt",
        phone: "+201000111222",
        orderItems: {
          create: [
            {
              productId: homeJersey.id,
              quantity: 2,
              price: 59.99,
            },
          ],
        },
      },
    });

    console.log("Created 5 sample orders with different statuses.");
  } else {
    console.warn("Admin user not found, skipping order creation.");
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
