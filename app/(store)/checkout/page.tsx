import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CheckoutForm from "./checkout-form";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/checkout");
  }

  // Fetch user details and last order for pre-filling
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      addresses: {
        take: 1,
      },
    },
  });

  // Determine initial data
  const lastOrder = user?.orders[0];
  const savedAddress = user?.addresses[0];

  // Logic to extract address parts if they are combined in Order
  let initialAddress = "";
  let initialCity = "";
  let initialPhone = "";

  if (lastOrder) {
    initialPhone = lastOrder.phone || "";
    // Try to parse address from last order if it exists
    if (lastOrder.address) {
      const parts = lastOrder.address.split(",").map((s: string) => s.trim());
      if (parts.length >= 2) {
        initialCity = parts.pop() || "";
        initialAddress = parts.join(", ");
      } else {
        initialAddress = lastOrder.address;
      }
    }
  } else if (savedAddress) {
    initialAddress = savedAddress.street;
    initialCity = savedAddress.city;
  }

  const initialData = {
    name: user?.name || session.user.name || "",
    email: user?.email || session.user.email || "",
    phone: initialPhone,
    address: initialAddress,
    city: initialCity,
  };

  return <CheckoutForm initialData={initialData} />;
}
