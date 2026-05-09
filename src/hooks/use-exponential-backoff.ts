"use client";

import { useCallback, useState } from "react";

const BASE_INTERVAL_MS = 5000;
const MAX_INTERVAL_MS = 60_000;
const BACKOFF_MULTIPLIER = 2;

export interface BackoffController {
  intervalMs: number;
  onError: () => void;
  onSuccess: () => void;
}

export function useExponentialBackoff(
  baseMs: number = BASE_INTERVAL_MS,
  maxMs: number = MAX_INTERVAL_MS,
): BackoffController {
  const [errorCount, setErrorCount] = useState(0);

  const onSuccess = useCallback(() => {
    setErrorCount((prev) => (prev === 0 ? prev : 0));
  }, []);

  const onError = useCallback(() => {
    setErrorCount((prev) => prev + 1);
  }, []);

  const intervalMs = Math.min(baseMs * BACKOFF_MULTIPLIER ** errorCount, maxMs);

  return { intervalMs, onError, onSuccess };
}
