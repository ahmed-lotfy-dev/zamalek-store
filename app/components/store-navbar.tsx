"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Badge,
} from "@heroui/react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import CartDrawer from "./store/cart-drawer";

export default function StoreNavbar() {
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
          <NavbarItem>
            <Button as={Link} color="primary" href="/admin/" variant="flat">
              Admin Dashboard
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <CartDrawer />
    </>
  );
}
