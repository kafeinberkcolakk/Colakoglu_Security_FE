import type { HealthState, HealthStatus } from "@/features/system/types/health";
import { beApiRoutes } from "@/lib/const/pages";

const HEALTH_FETCH_TIMEOUT_MS = 5000;

function parseStatus(value: unknown): HealthState {
  if (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    (value as { status: unknown }).status === "UP"
  ) {
    return "UP";
  }
  if (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    (value as { status: unknown }).status === "DOWN"
  ) {
    return "DOWN";
  }
  return "UNKNOWN";
}

export const healthApi = {
  get: async (): Promise<HealthStatus> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HEALTH_FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(beApiRoutes.health, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) {
        return { status: "DOWN" };
      }
      const data: unknown = await response.json();
      return { status: parseStatus(data) };
    } catch {
      return { status: "DOWN" };
    } finally {
      clearTimeout(timer);
    }
  },
};
