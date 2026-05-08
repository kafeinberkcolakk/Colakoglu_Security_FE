"use client";

import { useCallback, useEffect, useRef } from "react";

const MS_PER_SECOND = 1000;
const REFRESH_ENDPOINT = "/api/auth/refresh";
const REFRESH_INTERVAL_MS = 2 * 60 * MS_PER_SECOND;

export function SilentRefresh() {
  const inFlightRef = useRef<Promise<void> | null>(null);

  const refresh = useCallback(async () => {
    if (
      typeof document !== "undefined" &&
      document.visibilityState === "hidden"
    ) {
      return;
    }

    if (inFlightRef.current) {
      return;
    }

    const task = fetch(REFRESH_ENDPOINT, { method: "POST" })
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        inFlightRef.current = null;
      });

    inFlightRef.current = task;
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    const interval = window.setInterval(() => {
      void refresh();
    }, REFRESH_INTERVAL_MS);

    document.addEventListener("visibilitychange", onVisibilityChange);
    void refresh();

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refresh]);

  return null;
}
