"use client";

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";

const permissionContext = createContext<Set<string> | null>(null);

export function PermissionProvider({
  children,
  permissions,
}: PropsWithChildren<{ permissions: string[] }>) {
  const value = useMemo(() => new Set(permissions), [permissions]);

  return (
    <permissionContext.Provider value={value}>
      {children}
    </permissionContext.Provider>
  );
}

export function usePermissions() {
  return useContext(permissionContext);
}
