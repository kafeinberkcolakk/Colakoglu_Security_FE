"use client";

import { useEffect, useRef, useState } from "react";

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const REFRESH_BUFFER_SECONDS = 60;
const FALLBACK_REFRESH_MINUTES = 4;
const MIN_REFRESH_DELAY_SECONDS = 5;
const REFRESH_BUFFER_MS = REFRESH_BUFFER_SECONDS * MS_PER_SECOND;
const FALLBACK_REFRESH_MS =
  FALLBACK_REFRESH_MINUTES * SECONDS_PER_MINUTE * MS_PER_SECOND;
const MIN_REFRESH_DELAY_MS = MIN_REFRESH_DELAY_SECONDS * MS_PER_SECOND;

interface AccessTokenResponse {
  accessToken?: string;
  expiresAt?: number | null;
  ok: boolean;
}

interface FlowgroTokenState {
  error: Error | null;
  isLoading: boolean;
  token: string | null;
}

async function fetchAccessToken(): Promise<AccessTokenResponse | null> {
  const response = await fetch("/api/auth/access-token", {
    cache: "no-store",
    credentials: "include",
  });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as AccessTokenResponse;
}

function nextRefreshDelayMs(expiresAt: number | null | undefined): number {
  if (!expiresAt || !Number.isFinite(expiresAt)) {
    return FALLBACK_REFRESH_MS;
  }
  const remaining = expiresAt - Date.now() - REFRESH_BUFFER_MS;
  return Math.max(MIN_REFRESH_DELAY_MS, remaining);
}

export function useFlowgroToken(): FlowgroTokenState {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const schedule = (delayMs: number, fn: () => void) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(fn, delayMs);
    };

    const tick = async () => {
      try {
        const result = await fetchAccessToken();
        // biome-ignore lint/nursery/noUnnecessaryConditions: cancelled flips inside the cleanup callback after the await
        if (cancelled) {
          return;
        }
        if (!result?.ok || !result.accessToken) {
          setToken((prev) => (prev === null ? prev : null));
          setError(new Error("Failed to acquire Flowgro access token"));
          setIsLoading(false);
          schedule(FALLBACK_REFRESH_MS, tick);
          return;
        }
        const nextToken = result.accessToken;
        setToken((prev) => (prev === nextToken ? prev : nextToken));
        setError(null);
        setIsLoading(false);
        schedule(nextRefreshDelayMs(result.expiresAt), tick);
      } catch (cause) {
        if (cancelled) {
          return;
        }
        setError(cause instanceof Error ? cause : new Error("Unknown error"));
        setIsLoading(false);
        schedule(FALLBACK_REFRESH_MS, tick);
      }
    };

    void tick();

    return () => {
      cancelled = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return { error, isLoading, token };
}
