"use server";

import { cookies } from "next/headers";
import { type Locale, defaultLocale } from "@/i18n/config";
import { LOCALE_COOKIE_NAME } from "@/lib/locale-constants";
import { resolveLocale } from "@/lib/locale-utils";

export async function setUserLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, resolveLocale(locale));
}

export async function getUserLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? defaultLocale,
  );
}
