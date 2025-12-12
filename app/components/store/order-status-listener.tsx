"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { toast } from "@/app/components/ui/toast";

export default function OrderStatusListener({ orderId }: { orderId: string }) {
  const router = useRouter();

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.emit("join-order", orderId);
    });

    socket.on("status-update", (status) => {
      console.log("Order status updated:", status);
      toast.success(`Order status changed to ${status}`);
      router.refresh();
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId, router]);

  return null;
}
