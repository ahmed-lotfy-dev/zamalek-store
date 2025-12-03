import StoreNavbar from "@/app/components/store-navbar";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar user={session?.user} />
      {children}
    </div>
  );
}
