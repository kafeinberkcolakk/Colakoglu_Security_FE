export type HealthState = "UP" | "DOWN" | "UNKNOWN";

export interface HealthStatus {
  status: HealthState;
}
