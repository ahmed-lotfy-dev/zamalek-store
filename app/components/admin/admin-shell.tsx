"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  LayoutDashboard,
  Package,
  ListTree,
  ShoppingCart,
  Ticket,
  LogOut,
} from "lucide-react";
import AdminSidebar from "@/app/components/admin/admin-sidebar";
import { Link, Navbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/react";

import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Close menu on route change
  // Close menu on route change
  useEffect(() => {
    const timer = setTimeout(() => setIsMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

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
    <div className="flex min-h-screen relative w-full max-w-[100vw] overflow-x-hidden bg-background">
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40">
        <Navbar
          onMenuOpenChange={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
          maxWidth="full"
          className="border-b border-divider"
        >
          <NavbarContent justify="start">
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            />
          </NavbarContent>

          <NavbarContent justify="center">
            <NavbarBrand>
              <p className="font-bold text-inherit">Admin Panel</p>
            </NavbarBrand>
          </NavbarContent>

          <NavbarMenu className="pt-6">
            {links.map((link, index) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <NavbarMenuItem key={`${link.href}-${index}`}>
                  <Link
                    className="w-full gap-2"
                    color={isActive ? "primary" : "foreground"}
                    href={link.href}
                    size="lg"
                    onPress={() => setIsMenuOpen(false)}
                  >
                    <Icon size={20} />
                    {link.label}
                  </Link>
                </NavbarMenuItem>
              );
            })}
            <NavbarMenuItem>
              <Link
                className="w-full gap-2"
                color="danger"
                href="#"
                size="lg"
                onPress={handleSignOut}
              >
                <LogOut size={20} />
                Sign Out
              </Link>
            </NavbarMenuItem>
          </NavbarMenu>
        </Navbar>
      </div>

      {/* Sidebar (Desktop Only) */}
      <div className="hidden md:block">
        <AdminSidebar isOpen={true} onClose={() => { }} />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-background p-4 pt-20 md:p-8 md:pt-8 w-full">
        {children}
      </main>
    </div>
  );
}
