import StoreNavbar from "@/app/components/store-navbar";
import StoreFooter from "@/app/components/store-footer";
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
    <div className="min-h-screen bg-background flex flex-col">
      <StoreNavbar user={session?.user} />
      <div className="flex-1">{children}</div>
      <StoreFooter />
    </div>
  );
}
