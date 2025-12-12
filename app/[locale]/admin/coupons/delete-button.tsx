"use client";

import { deleteCoupon } from "@/app/lib/actions/coupons";
import { Button } from "@/components/ui/button";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export function DeleteCouponButton({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    setIsLoading(true);
    try {
      const result = await deleteCoupon(id);
      if (result.success) {
        toast.success("Coupon deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
      onClick={handleDelete}
      disabled={isLoading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
