import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/app/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const role = session?.user?.role;

  if (role !== "ADMIN" && role !== "VIEWER") {
    redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}
