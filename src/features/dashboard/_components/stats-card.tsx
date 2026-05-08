"use client";

import { WidgetCard } from "@/components/ui/widget-card";

interface StatsCardProps {
  subtitle?: string;
  title: string;
  value: number | string;
  viewAll?: string;
}

export function StatsCard({ subtitle, title, value, viewAll }: StatsCardProps) {
  return (
    <WidgetCard subtitle={subtitle} title={title} viewAll={viewAll}>
      <p className="text-3xl font-semibold text-foreground">{value}</p>
    </WidgetCard>
  );
}
