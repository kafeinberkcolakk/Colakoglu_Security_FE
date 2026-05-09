import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { RelativeTimeLabels } from "@/lib/format";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function useRelativeLabels(): RelativeTimeLabels {
  const tRel = useTranslations("relative");
  return useMemo(
    () => ({
      days: asString(tRel.raw("days")),
      hours: asString(tRel.raw("hours")),
      minutes: asString(tRel.raw("minutes")),
      seconds: asString(tRel.raw("seconds")),
    }),
    [tRel],
  );
}
