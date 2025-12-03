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
        <p className="font-bold text-inherit">Zamalek Store</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="/admin/products"
            variant="flat"
          >
            Admin Dashboard
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
