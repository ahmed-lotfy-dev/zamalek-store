"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { useCart } from "@/app/context/cart-context";
import { authClient } from "@/app/lib/auth-client";
import { useTranslations } from "next-intl";
import { ShoppingBag, Heart, Menu, User, LogOut, LayoutDashboard, ShoppingCart, Search } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const tHome = useTranslations("HomePage");

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: t("home"), href: "/" },
    { name: t("shop"), href: "/products" },
    { name: "Jerseys", href: "/products?category=jerseys" },
    { name: "Training", href: "/products?category=training" },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b border-transparent",
          isScrolled
            ? "glass h-16 shadow-sm border-border/40"
            : "bg-transparent h-20"
        )}
      >
        <div className="container h-full flex items-center justify-between px-6 max-w-7xl mx-auto">
          {/* Mobile Menu & Search (Left) */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r border-border">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="text-2xl font-black italic tracking-tighter text-primary">
                    {tHome("title").toUpperCase()}
                  </SheetTitle>
                  <SheetDescription>Explore the official collection.</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-2">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "text-lg font-medium px-4 py-3 rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="text-lg font-medium px-4 py-3 rounded-md text-foreground hover:bg-muted"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("adminDashboard")}
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo (Center Mobile, Left Desktop) */}
          <div className="flex md:flex-1 justify-center md:justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Optional: Add Logo Icon Here */}
              <span className="text-2xl md:text-3xl font-black tracking-tighter italic group-hover:text-primary transition-colors duration-300">
                {tHome("title").toUpperCase()}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "text-sm font-semibold uppercase tracking-wide transition-colors hover:text-primary relative group py-2",
                  pathname === item.href ? "text-primary" : "text-foreground/80"
                )}
              >
                {item.name}
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                  pathname === item.href ? "scale-x-100" : ""
                )} />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
            <div className="hidden md:flex">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>

            <Button variant="ghost" size="icon" className="hidden md:flex hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/saved">
              <Button variant="ghost" size="icon" className="hover:text-destructive transition-colors">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-primary transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-2 border-background"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full ml-1 md:ml-2 border border-border/50">
                    <Avatar className="h-7 w-7 md:h-8 md:w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="text-primary font-bold bg-primary/10">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
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
                      <Link href="/admin" className="cursor-pointer text-primary">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t("adminDashboard")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
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
              <Button asChild className="ml-2 font-semibold rounded-full px-6" size="sm">
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
