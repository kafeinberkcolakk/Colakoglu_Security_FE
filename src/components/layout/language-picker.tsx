"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Locale, locales } from "@/i18n/config";
import { setUserLocale } from "@/lib/locale";

export function LanguagePicker() {
  const router = useRouter();
  const tLangs = useTranslations("langs");
  const tCore = useTranslations("core");
  const currentLocale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const onSelect = (locale: Locale) => {
    if (locale === currentLocale) {
      return;
    }
    startTransition(async () => {
      await setUserLocale(locale);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={tCore("language")}
        className="flex size-8 items-center justify-center rounded text-white transition-colors hover:bg-white/10 disabled:opacity-50"
        disabled={isPending}
        type="button"
      >
        <Languages className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            data-active={locale === currentLocale}
            key={locale}
            onSelect={() => onSelect(locale)}
          >
            <span className="font-mono text-xs uppercase text-muted-foreground">
              {locale}
            </span>
            <span className="ml-2">{tLangs(locale)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
