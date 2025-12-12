"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/20">
      <p className="text-muted-foreground">No products found.</p>
      <Link href="/admin/products/new">
        <Button
          variant="ghost"
          className="text-primary mt-2"
        >
          Add your first product
        </Button>
      </Link>
    </div>
  );
}
