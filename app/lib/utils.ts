export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "PAID":
      return "success";
    case "SHIPPED":
      return "warning";
    case "DELIVERED":
      return "success";
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
};

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}