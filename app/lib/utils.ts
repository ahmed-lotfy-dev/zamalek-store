import { OrderStatus } from "@prisma/client";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
    case OrderStatus.PENDING:
      return "warning";
    case "PAID":
    case OrderStatus.PAID:
      return "primary";
    case "SHIPPED":
    case OrderStatus.SHIPPED:
      return "secondary";
    case "DELIVERED":
    case OrderStatus.DELIVERED:
      return "success";
    case "CANCELLED":
    case OrderStatus.CANCELLED:
      return "danger";
    default:
      return "default";
  }
};
