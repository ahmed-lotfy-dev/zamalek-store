"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import CartDrawer from "./store/cart-drawer";
import { authClient } from "@/app/lib/auth-client";

export default function StoreNavbar({ user }: { user?: any }) {
  const { setIsCartOpen, cartCount } = useCart();

  return (
    <>
      <Navbar maxWidth="xl" position="sticky">
        <NavbarBrand>
          <Link href="/" color="foreground">
            <p className="font-bold text-inherit text-xl">Zamalek Store</p>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
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
            <NavbarItem>
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
      </Navbar>
      <CartDrawer />
    </>
  );
}
