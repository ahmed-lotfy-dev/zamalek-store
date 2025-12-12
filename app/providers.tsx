import { ThemeProvider as NextThemesProvider } from "next-themes";

import { CartProvider } from "./context/cart-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <CartProvider>{children}</CartProvider>
    </NextThemesProvider>
  );
}
