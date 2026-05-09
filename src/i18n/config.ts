export type Locale = (typeof locales)[number];

export const locales = ["tr", "en"] as const;
export const defaultLocale: Locale = "tr";
