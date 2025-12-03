"use client";

import { Link } from "@heroui/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await authClient.getSession();
      if (!session) {
        router.push("/sign-in");
      }
      setIsPending(false);
    };
    checkAuth();
  }, [router]);

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/orders", label: "Orders" },
  ];

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white p-6 hidden md:block">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Zamalek Store</h1>
          <p className="text-sm text-zinc-400">Admin Panel</p>
        </div>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`p-2 rounded-lg transition-colors ${
                pathname === link.href
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-8">{children}</main>
    </div>
  );
}
