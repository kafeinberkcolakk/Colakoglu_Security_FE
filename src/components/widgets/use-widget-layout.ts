"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { WidgetDefinition, WidgetLayout, WidgetRegistry } from "./types";

const STORAGE_PREFIX = "dashboard:layout:";
const PERSIST_DEBOUNCE_MS = 300;

function storageKey(screenId: string): string {
  return `${STORAGE_PREFIX}${screenId}`;
}

function buildDefaults(registry: WidgetRegistry): WidgetLayout[] {
  return registry.map((def) => ({ ...def.defaultLayout, i: def.id }));
}

function reconcileWithRegistry(
  stored: WidgetLayout[],
  registry: WidgetRegistry,
): WidgetLayout[] {
  const storedById = new Map(stored.map((entry) => [entry.i, entry]));
  return registry.map((def) => {
    const entry = storedById.get(def.id);
    return entry ?? { ...def.defaultLayout, i: def.id };
  });
}

function readStored(screenId: string): WidgetLayout[] | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(storageKey(screenId));
    if (raw === null || raw === "") {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed.filter(
      (entry): entry is WidgetLayout =>
        entry !== null &&
        typeof entry === "object" &&
        typeof (entry as WidgetLayout).i === "string",
    );
  } catch {
    return null;
  }
}

function writeStored(screenId: string, layout: WidgetLayout[]): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(storageKey(screenId), JSON.stringify(layout));
  } catch {
    // localStorage may be unavailable (private mode / quota); ignore.
  }
}

function writeHidden(screenId: string, hiddenIds: ReadonlySet<string>): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(
      storageKey(`${screenId}:hidden`),
      JSON.stringify(Array.from(hiddenIds).map((value) => ({ i: value }))),
    );
  } catch {
    // ignore
  }
}

export interface UseWidgetLayoutResult {
  editing: boolean;
  hiddenIds: ReadonlySet<string>;
  hideWidget: (id: string) => void;
  layout: WidgetLayout[];
  reset: () => void;
  setEditing: (next: boolean) => void;
  setLayout: (next: WidgetLayout[]) => void;
  showWidget: (id: string) => void;
  visibleDefinitions: WidgetDefinition[];
}

export function useWidgetLayout(
  screenId: string,
  registry: WidgetRegistry,
): UseWidgetLayoutResult {
  const defaults = useMemo(() => buildDefaults(registry), [registry]);

  // Widget grid is always client-only (loaded via next/dynamic ssr:false),
  // so lazy localStorage init is safe — no hydration mismatch.
  const [layout, setLayoutState] = useState<WidgetLayout[]>(() => {
    const stored = readStored(screenId);
    return stored === null ? defaults : reconcileWithRegistry(stored, registry);
  });
  const [hiddenIds, setHiddenIds] = useState<ReadonlySet<string>>(() => {
    const hidden = readStored(`${screenId}:hidden`);
    return hidden === null
      ? new Set()
      : new Set(hidden.map((entry) => entry.i));
  });
  const [editing, setEditing] = useState(false);

  // Debounce localStorage writes so drag pixels don't trigger 100s of setItem calls.
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (persistTimer.current !== null) {
        clearTimeout(persistTimer.current);
      }
    },
    [],
  );

  const setLayout = useCallback(
    (next: WidgetLayout[]) => {
      setLayoutState(next);
      if (persistTimer.current !== null) {
        clearTimeout(persistTimer.current);
      }
      persistTimer.current = setTimeout(() => {
        writeStored(screenId, next);
        persistTimer.current = null;
      }, PERSIST_DEBOUNCE_MS);
    },
    [screenId],
  );

  const reset = useCallback(() => {
    setLayoutState(defaults);
    setHiddenIds(new Set());
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(storageKey(screenId));
        window.localStorage.removeItem(storageKey(`${screenId}:hidden`));
      } catch {
        // ignore
      }
    }
  }, [defaults, screenId]);

  const hideWidget = useCallback(
    (id: string) => {
      setHiddenIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        writeHidden(screenId, next);
        return next;
      });
    },
    [screenId],
  );

  const showWidget = useCallback(
    (id: string) => {
      setHiddenIds((prev) => {
        if (!prev.has(id)) {
          return prev;
        }
        const next = new Set(prev);
        next.delete(id);
        writeHidden(screenId, next);
        return next;
      });
    },
    [screenId],
  );

  const visibleDefinitions = useMemo(
    () => registry.filter((def) => !hiddenIds.has(def.id)),
    [registry, hiddenIds],
  );

  return {
    editing,
    hiddenIds,
    hideWidget,
    layout,
    reset,
    setEditing,
    setLayout,
    showWidget,
    visibleDefinitions,
  };
}
