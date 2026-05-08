import { type Locale, defaultLocale, locales } from "@/i18n/config";

export function resolveLocale(value?: string | null): Locale {
  if (!value) {
    return defaultLocale;
  }

  const normalized = value.toLowerCase();
  return locales.find((locale) => locale === normalized) ?? defaultLocale;
}
