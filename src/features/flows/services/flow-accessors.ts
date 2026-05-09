import type { Flow } from "@/features/flows/types/flow";

export function getNatsSubject(flow: Flow): string {
  const value = flow.parameters.natsSubject;
  return typeof value === "string" ? value : "";
}
