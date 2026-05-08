"use client";

import { CollectorFormScreen } from "@/features/collectors/_components/collector-form-screen";
import { collectorTypeRegistry } from "@/features/collectors/_components/config/type-registry";

export default function NewCollectorPage() {
  return (
    <CollectorFormScreen
      defaultValues={collectorTypeRegistry.WEBHOOK.defaultValues()}
    />
  );
}
