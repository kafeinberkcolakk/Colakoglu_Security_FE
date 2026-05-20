import type { Flow, FlowStep } from "@/features/flows/types/flow";

const FLOW_STEPS: readonly FlowStep[] = ["FETCH", "NATS", "DB"];

export function isFlowStep(value: unknown): value is FlowStep {
  return (
    typeof value === "string" &&
    (FLOW_STEPS as readonly string[]).includes(value)
  );
}

// productName == BPMN branch name for the new BE (app1 | app2).
export function getProductName(flow: Flow): string {
  return flow.name;
}
