"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@heroui/react";

import { authClient } from "@/app/lib/auth-client";
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
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Admin");
  const tHome = useTranslations("HomePage");

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
    { href: "/", label: t("storefront"), icon: Home },
    { href: "/admin", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/admin/products", label: t("products"), icon: Package },
    { href: "/admin/categories", label: t("categories"), icon: ListTree },
    { href: "/admin/orders", label: t("orders"), icon: ShoppingCart },
    { href: "/admin/coupons", label: t("coupons"), icon: Ticket },
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
          <h1 className="text-2xl font-bold text-primary">{tHome("title")}</h1>
          <p className="text-tiny text-default-500 uppercase font-bold tracking-wider">
            {t("panel")}
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

      <div className="mt-auto pt-4 border-t border-divider flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
        <Button
          fullWidth
          variant="flat"
          color="danger"
          onPress={async () => {
            await authClient.signOut();
            router.push("/");
          }}
        >
          <LogOut size={20} />
          {t("signOut")}
        </Button>
      </div>
    </aside>
  );
}
