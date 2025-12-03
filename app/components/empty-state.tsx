"use client";

import { Button, Link } from "@heroui/react";

export default function EmptyState() {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-default-300 bg-default-50">
      <p className="text-default-500">No products found.</p>
      <Button
        as={Link}
        href="/admin/products/new"
        color="primary"
        variant="light"
        className="mt-2"
      >
        Add your first product
      </Button>
    </div>
  );
}
