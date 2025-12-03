import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./layout-client";

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
  if (role !== "ADMIN" && role !== "VIEWER") {
    redirect("/");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
