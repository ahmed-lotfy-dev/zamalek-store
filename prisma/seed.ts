import { prisma } from "../app/lib/prisma";

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
    const user = await prisma.user.create({
      data: {
        name: "Admin User",
        email: adminEmail,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: adminPassword, // Note: In a real app, this should be hashed
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.warn(
      "ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin user creation."
    );
  }

  // Create Products
  // 1. Home Jersey
  await prisma.product.create({
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
  await prisma.product.create({
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
  await prisma.product.create({
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
  await prisma.product.create({
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
  await prisma.product.create({
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
