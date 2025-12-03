"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";

export default function StoreNavbar() {
  return (
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
          <Button as={Link} color="primary" href="/admin/" variant="flat">
            Admin Dashboard
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
