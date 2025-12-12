"use client";

import { updateOrderStatus } from "@/app/lib/actions/orders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { OrderStatus } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    const statusValue = newStatus as OrderStatus;
    setStatus(statusValue);
    setIsLoading(true);

    try {
      const result = await updateOrderStatus(orderId, statusValue);
      if (result.success) {
        toast.success("Order status updated");
      } else {
        toast.error(result.error || "Failed to update status");
        setStatus(currentStatus); // Revert on error
      }
    } catch (error) {
      toast.error("Something went wrong");
      setStatus(currentStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(OrderStatus).map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
