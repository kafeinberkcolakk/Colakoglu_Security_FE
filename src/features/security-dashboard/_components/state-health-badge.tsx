"use client";

import { useTranslations } from "next-intl";
import { HEALTH_COLORS, type StateHealth } from "@/lib/const/severity";

// ~12% opacity suffix for a 6-digit hex color, used as the pill tint.
const TINT_ALPHA = "22";

interface StateHealthBadgeProps {
  health: StateHealth;
}

export function StateHealthBadge({ health }: StateHealthBadgeProps) {
  const t = useTranslations("page.securityDashboard.health");
  const color = HEALTH_COLORS[health];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: `${color}${TINT_ALPHA}`, color }}
    >
      <span
        aria-hidden={true}
        className="size-1.5 rounded-full"
        style={{ background: color }}
      />
      {t(health)}
    </span>
  );
}
