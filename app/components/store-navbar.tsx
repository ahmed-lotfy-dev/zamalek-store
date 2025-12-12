"use client";

import React from "react";
import { Avatar, Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/react";

import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import CartDrawer from "./store/cart-drawer";
import { authClient } from "@/app/lib/auth-client";
import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { useLocale, useTranslations } from "next-intl";

export default function StoreNavbar({ user }: { user?: any }) {
  const { setIsCartOpen, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
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
      <Navbar
        maxWidth="xl"
        position="sticky"
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      >
        <NavbarContent className="md:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        <NavbarContent className="md:hidden pr-3" justify="center">
          <NavbarBrand>
            <Link href="/" className="text-foreground">
              <p className="font-bold text-inherit text-xl">{tHome("title")}</p>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden md:flex gap-4" justify="start">
          <NavbarBrand className="mr-4">
            <Link href="/" className="text-foreground">
              <p className="font-bold text-inherit text-xl">{tHome("title")}</p>
            </Link>
          </NavbarBrand>
          <NavbarItem>
            <Link className="text-foreground" href="/">
              {t("home")}
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-foreground" href="/products">
              {t("shop")}
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
          <NavbarItem>
            <LanguageSwitcher />
          </NavbarItem>
          <NavbarItem>
            <Link href="/saved" aria-label="Saved Items">
              <Button
                isIconOnly
                color="primary"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Badge
              content={cartCount}
              color="primary"
              isInvisible={cartCount === 0}
              shape="circle"
            >
              <Button
                isIconOnly
                color="primary"
                onPress={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Badge>
          </NavbarItem>
          {user?.role === "ADMIN" && (
            <NavbarItem className="hidden md:flex">
              <Link href="/admin">
                <Button color="primary">
                  {t("adminDashboard")}
                </Button>
              </Link>
            </NavbarItem>
          )}
          {user ? (
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="primary"
                    name={user.name}
                    size="sm"
                    src={user.image || undefined}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">{t("signedInAs")}</p>
                    <p className="font-semibold">{user.email}</p>
                  </DropdownItem>
                  <DropdownItem key="dashboard" href="/profile" as={Link}>
                    {t("myProfile")}
                  </DropdownItem>
                  <DropdownItem key="orders" href="/profile/orders" as={Link}>
                    {t("myOrders")}
                  </DropdownItem>
                  {user.role === "ADMIN" ? (
                    <DropdownItem key="admin" href="/admin" as={Link}>
                      {t("adminDashboard")}
                    </DropdownItem>
                  ) : (
                    <DropdownItem key="hidden-admin" className="hidden" />
                  )}
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onPress={async () => {
                      await authClient.signOut();
                      window.location.href = "/";
                    }}
                  >
                    {t("logOut")}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          ) : (
            <NavbarItem>
              <Link href="/sign-in">
                <Button color="primary">
                  {t("signIn")}
                </Button>
              </Link>
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarMenu className="pt-6 gap-4">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full text-foreground text-lg font-medium py-2 block"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          {user?.role === "ADMIN" && (
            <NavbarMenuItem>
              <Link
                className="w-full text-primary text-lg font-medium py-2 block"
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("adminDashboard")}
              </Link>
            </NavbarMenuItem>
          )}
        </NavbarMenu>
      </Navbar>
      <CartDrawer />
    </>
  );
}
