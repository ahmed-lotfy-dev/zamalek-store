// app/providers.tsx
"use client";

import { HeroUIProvider as HeroUIProviderBase } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@heroui/toast";

export default function HeroUiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <HeroUIProviderBase navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <ToastProvider />
        {children}
      </NextThemesProvider>
    </HeroUIProviderBase>
  );
}
