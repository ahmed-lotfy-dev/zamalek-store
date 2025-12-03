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

  // @ts-ignore
  const role = session.user.role;
  console.log("Admin Layout Session:", JSON.stringify(session, null, 2));
  console.log("User Role:", role);

  if (role !== "ADMIN" && role !== "VIEWER") {
    // console.log("Redirecting to / due to role mismatch");
    // redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}
