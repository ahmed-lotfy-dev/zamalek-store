export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "PAID":
      return "primary";
    case "SHIPPED":
      return "secondary";
    case "DELIVERED":
      return "success";
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
};
