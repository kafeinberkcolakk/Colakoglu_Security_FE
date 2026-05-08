"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function ThemePicker() {
  const { setTheme, theme } = useTheme();
  const t = useTranslations();

  if (theme === "light") {
    return (
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        <Moon />
        {t("theme.dark")}
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem onClick={() => setTheme("light")}>
      <Sun />
      {t("theme.light")}
    </DropdownMenuItem>
  );
}
