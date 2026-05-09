import type { FlowRun } from "@/features/flows/types/flow";
import { MS_PER_HOUR } from "@/lib/const/intervals";

const PERCENT_SCALE = 100;
const P95_QUANTILE = 0.95;

function completedRuns(runs: FlowRun[]): FlowRun[] {
  return runs.filter((run) => run.durationMs !== null);
}

export function successRate(runs: FlowRun[]): number {
  const completed = completedRuns(runs);
  if (completed.length === 0) {
    return 0;
  }
  const successful = completed.filter((run) => run.success).length;
  return Math.round((successful / completed.length) * PERCENT_SCALE);
}

export function avgDurationMs(runs: FlowRun[]): number {
  const completed = completedRuns(runs);
  if (completed.length === 0) {
    return 0;
  }
  const total = completed.reduce((acc, run) => acc + (run.durationMs ?? 0), 0);
  return Math.round(total / completed.length);
}

export function p95DurationMs(runs: FlowRun[]): number {
  const durations = completedRuns(runs)
    .map((run) => run.durationMs ?? 0)
    .sort((left, right) => left - right);
  if (durations.length === 0) {
    return 0;
  }
  const index = Math.max(0, Math.ceil(P95_QUANTILE * durations.length) - 1);
  return durations[index] ?? 0;
}

export function lastErrorMessage(runs: FlowRun[]): string | null {
  const failed = runs.find((run) => run.success === false && run.errorMessage);
  return failed?.errorMessage ?? null;
}

export function runsWithinHours(runs: FlowRun[], hours: number): FlowRun[] {
  const threshold = Date.now() - hours * MS_PER_HOUR;
  return runs.filter((run) => {
    const startedTime = Date.parse(run.startedAt);
    return Number.isFinite(startedTime) && startedTime >= threshold;
  });
}

export function totalMessagesPublished(runs: FlowRun[]): number {
  return runs.reduce((acc, run) => acc + (run.messagesPublished ?? 0), 0);
}
