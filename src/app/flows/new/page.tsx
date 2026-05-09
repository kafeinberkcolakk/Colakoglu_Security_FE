"use client";

import { flowTypeRegistry } from "@/features/flows/_components/config/type-registry";
import { FlowFormScreen } from "@/features/flows/_components/flow-form-screen";

export default function NewFlowPage() {
  return (
    <FlowFormScreen
      defaultValues={flowTypeRegistry.webhook_collector.defaultValues()}
    />
  );
}
