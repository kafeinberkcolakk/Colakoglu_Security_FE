// Flow domain types — aligned with FE_API.md (BPMN continuousAppPollingProcess).
// Flows are no longer CRUD entities; they are runtime BPMN branches exposed by
// GET /api/flows. Each call returns the live state of every branch.

export type FlowStep = "FETCH" | "NATS" | "DB";

export interface Flow {
  active: boolean;
  currentStep: FlowStep | null;
  endpoint: string;
  intervalSeconds: number;
  lastIngestedAt: string | null;
  maxRetryCount: number;
  name: string;
  retryCount: number;
}

export interface FlowList {
  items: Flow[];
  processDefinitionKey: string | null;
  processInstanceId: string | null;
  total: number;
}
