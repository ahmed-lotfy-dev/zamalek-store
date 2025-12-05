"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import CartDrawer from "./store/cart-drawer";
import { authClient } from "@/app/lib/auth-client";
import { usePathname } from "next/navigation";

export default function StoreNavbar({ user }: { user?: any }) {
  const { setIsCartOpen, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Jerseys", href: "/products?category=jerseys" },
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
            <Link href="/" color="foreground">
              <p className="font-bold text-inherit text-xl">Zamalek Store</p>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden md:flex gap-4" justify="start">
          <NavbarBrand className="mr-4">
            <Link href="/" color="foreground">
              <p className="font-bold text-inherit text-xl">Zamalek Store</p>
            </Link>
          </NavbarBrand>
          <NavbarItem>
            <Link color="foreground" href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/products">
              Shop
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/products?category=jerseys">
              Jerseys
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              as={Link}
              href="/saved"
              aria-label="Saved Items"
            >
              <Heart className="w-5 h-5" />
            </Button>
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
                variant="light"
                onPress={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Badge>
          </NavbarItem>
          {user?.role === "ADMIN" && (
            <NavbarItem className="hidden md:flex">
              <Button as={Link} color="primary" href="/admin" variant="flat">
                Admin Dashboard
              </Button>
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
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user.email}</p>
                  </DropdownItem>
                  <DropdownItem key="dashboard" href="/profile">
                    My Profile
                  </DropdownItem>
                  <DropdownItem key="orders" href="/profile/orders">
                    My Orders
                  </DropdownItem>
                  {user.role === "ADMIN" ? (
                    <DropdownItem key="admin" href="/admin">
                      Admin Dashboard
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
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          ) : (
            <NavbarItem>
              <Button as={Link} color="primary" href="/sign-in" variant="flat">
                Sign In
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color="foreground"
                href={item.href}
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          {user?.role === "ADMIN" && (
            <NavbarMenuItem>
              <Link
                className="w-full"
                color="primary"
                href="/admin"
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            </NavbarMenuItem>
          )}
        </NavbarMenu>
      </Navbar>
      <CartDrawer />
    </>
  );
}
