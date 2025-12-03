// app/providers.tsx
"use client";

import { HeroUIProvider as HeroUIProviderBase } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function HeroUiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <HeroUIProviderBase navigate={router.push}>{children}</HeroUIProviderBase>
  );
}
