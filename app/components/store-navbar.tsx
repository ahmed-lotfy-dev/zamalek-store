"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { useCart } from "@/app/context/cart-context";
import { authClient } from "@/app/lib/auth-client";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingBag, Heart, Menu, User, LogOut, LayoutDashboard, ShoppingCart } from "lucide-react";

import { cn } from "@/app/lib/utils"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import CartDrawer from "./store/cart-drawer";

export default function StoreNavbar({ user }: { user?: any }) {
  const { setIsCartOpen, cartCount } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const tHome = useTranslations("HomePage");
  const locale = useLocale();

  const menuItems = [
    { name: t("home"), href: "/" },
    { name: t("shop"), href: "/products" },
  ];

  return (
    <>
      <header className="sticky top-0 m-auto z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-6">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetHeader>
                <SheetTitle className="text-left font-bold">{tHome("title")}</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation Menu
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block px-2 py-1 text-lg font-medium text-foreground/80 hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block px-2 py-1 text-lg font-medium text-primary hover:text-primary/80"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("adminDashboard")}
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block text-xl">
                {tHome("title")}
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile Logo (Centered) */}
          <div className="flex flex-1 md:hidden">
            <Link href="/" className="font-bold text-xl">
              {tHome("title")}
            </Link>
          </div>


          {/* Right Actions */}
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeSwitcher />
            <LanguageSwitcher />

            <Link href="/saved">
              <Button variant="ghost" size="icon" aria-label="Saved Items">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Cart"
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            {user?.role === "ADMIN" && (
              <Button variant="default" className="hidden md:flex ml-2" asChild>
                <Link href="/admin">
                  {t("adminDashboard")}
                </Link>
              </Button>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {t("myProfile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/orders" className="cursor-pointer">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {t("myOrders")}
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t("adminDashboard")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer focus:text-red-600"
                    onClick={async () => {
                      await authClient.signOut();
                      window.location.href = "/";
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="ml-2">
                <Link href="/sign-in">
                  {t("signIn")}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}
