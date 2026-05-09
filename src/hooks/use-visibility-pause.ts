"use client";

import { useEffect, useState } from "react";

export function useDocumentHidden(): boolean {
  const [hidden, setHidden] = useState(() =>
    typeof document === "undefined" ? false : document.hidden,
  );

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const onVisibilityChange = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return hidden;
}

export function useVisiblePolling(intervalMs: number): number | false {
  const hidden = useDocumentHidden();
  return hidden ? false : intervalMs;
}
