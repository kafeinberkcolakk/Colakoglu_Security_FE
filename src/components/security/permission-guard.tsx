"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { usePermissions } from "./permission-provider";

function hasPermission(
  permissions: Set<string>,
  permissionKey: string | string[],
): boolean {
  const keys = Array.isArray(permissionKey) ? permissionKey : [permissionKey];

  return keys.some((key) => {
    if (key.endsWith("*")) {
      const prefix = key.slice(0, -1);
      return [...permissions].some((permission) =>
        permission.startsWith(prefix),
      );
    }

    return permissions.has(key);
  });
}

export function PermissionGuard({
  children,
  fallback = null,
  permissionKey,
}: PropsWithChildren<{
  fallback?: ReactNode;
  permissionKey: string | string[];
}>) {
  const permissions = usePermissions();

  if (!permissions) {
    return fallback;
  }

  return hasPermission(permissions, permissionKey) ? children : fallback;
}
