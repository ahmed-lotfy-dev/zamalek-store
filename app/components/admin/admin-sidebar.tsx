"use client";

import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { authClient } from "@/app/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  Package,
  ListTree,
  ShoppingCart,
  Home,
  LogOut,
  Ticket,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const links = [
    { href: "/", label: "Storefront", icon: Home },
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: ListTree },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  ];

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-content1 border-r border-divider p-6
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        flex flex-col min-h-screen
      `}
    >
      <div className="mb-8 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-primary">Zamalek Store</h1>
          <p className="text-tiny text-default-500 uppercase font-bold tracking-wider">
            Admin Panel
          </p>
        </div>
        <Button
          isIconOnly
          variant="light"
          className="md:hidden"
          onPress={onClose}
        >
          <X size={20} />
        </Button>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Button
              key={link.href}
              as={Link}
              href={link.href}
              variant={isActive ? "flat" : "light"}
              color={isActive ? "primary" : "default"}
              className="justify-start gap-4"
              size="lg"
              fullWidth
            >
              <Icon size={20} />
              {link.label}
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-divider">
        <Button
          variant="light"
          color="danger"
          className="justify-start gap-4"
          size="lg"
          fullWidth
          onPress={handleSignOut}
        >
          <LogOut size={20} />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
