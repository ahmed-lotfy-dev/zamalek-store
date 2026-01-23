import { prisma } from "../app/lib/prisma";

async function checkZamalekDb() {
  console.log("🔍 Checking Zamalek Store Database...");

  try {
    // 1. Check Connection and Schema
    console.log("📡 Attempting to fetch products...");
    const productsCount = await prisma.product.count();
    console.log(`✅ Connection Successful! Products: ${productsCount}`);

    // 2. Check Permissions
    console.log("📑 Checking table access...");
    const firstProduct = await prisma.product.findFirst();
    console.log(`✨ Access Verified! First Product: ${firstProduct?.name || 'None'}`);

  } catch (error: any) {
    console.error("❌ Database Connection/Permission Error:");
    console.error(`Message: ${error.message}`);
    console.error(`Code: ${error.code}`);
    if (error.meta) console.error(`Meta: ${JSON.stringify(error.meta)}`);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

checkZamalekDb();
