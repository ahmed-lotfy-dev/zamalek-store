import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";
import { CartProvider } from "./context/cart-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <ToastProvider placement="bottom-center" />
      <CartProvider>{children}</CartProvider>
    </NextThemesProvider>
  );
}
