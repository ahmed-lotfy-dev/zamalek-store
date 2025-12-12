"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/app/lib/utils"

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
  onClose?: () => void; // Optional here as we handle desktop/mobile differently
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Admin");
  const tHome = useTranslations("HomePage");

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
      className={cn(
        "bg-card border-r flex flex-col h-full",
        // Mobile styles handled by Sheet, so this component can be just the content
        "w-full md:w-64"
      )}
    >
      <div className="p-6 flex justify-between items-center border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-primary">{tHome("title")}</h1>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
            {t("panel")}
          </p>
        </div>
        {onClose && (
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="w-full block"
              onClick={onClose}
            >
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 text-base",
                  isActive ? "text-primary font-medium" : "text-muted-foreground font-normal"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t flex flex-col gap-4 bg-muted/20">
        <div className="flex items-center justify-between px-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
        <Button
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          variant="ghost"
          onClick={async () => {
            await authClient.signOut();
            router.push("/");
          }}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {t("signOut")}
        </Button>
      </div>
    </aside>
  );
}
