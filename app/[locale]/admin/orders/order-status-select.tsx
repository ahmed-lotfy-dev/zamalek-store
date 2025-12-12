"use client";

import { updateOrderStatus } from "@/app/lib/actions/orders";
import { Select, ListBox, Label } from "@heroui/react";

import { OrderStatus } from "@prisma/client";
import { useState } from "react";
import { toast } from "@/app/components/ui/toast";

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
      selectedKey={status}
      onSelectionChange={(keys) => {
        if (keys && keys !== "all") {
          const newStatus = Array.from(keys as unknown as Set<string>)[0];
          handleStatusChange(newStatus);
        }
      }}
      isDisabled={isLoading}
      className="min-w-[140px]"
    >
      <Label>Status</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {Object.values(OrderStatus).map((s) => (
            <ListBox.Item key={s} id={s} textValue={s}>
              {s}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
