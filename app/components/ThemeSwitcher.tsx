"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
}
