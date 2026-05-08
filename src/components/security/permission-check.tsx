import type { ReactNode } from "react";
import { BE_API_URL } from "@/lib/config";
import { beApiRoutes } from "@/lib/const/pages";
import { getSession } from "@/lib/open-id";
import { PermissionProvider } from "./permission-provider";

interface PermissionCheckProps {
  children: ReactNode;
  permissionKey: string | string[];
  placeHolder?: ReactNode;
}

function normalizePermissions(data: unknown): string[] {
  const normalizeArray = (items: unknown[]) =>
    items
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          const candidate = record.name ?? record.id;
          return typeof candidate === "string" ? candidate : "";
        }

        return "";
      })
      .filter((item) => item.length > 0);

  if (Array.isArray(data)) {
    return normalizeArray(data);
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidates = [
      record.permissions,
      record.roles,
      record.items,
      record.data,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return normalizeArray(candidate);
      }
    }
  }

  return [];
}

async function getUserPermissions() {
  const session = await getSession();

  const response = await fetch(
    `${BE_API_URL}${beApiRoutes.users.permissions}`,
    {
      headers: {
        authorization: `Bearer ${session.accessToken ?? ""}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: { tags: ["permissions"] },
    },
  );

  if (!response.ok) {
    return new Set<string>();
  }

  const payload = await response.json();
  return new Set(normalizePermissions(payload));
}

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

export default async function PermissionCheck({
  children,
  permissionKey,
  placeHolder,
}: PermissionCheckProps) {
  const permissions = await getUserPermissions();

  if (!hasPermission(permissions, permissionKey)) {
    return placeHolder ?? null;
  }

  return (
    <PermissionProvider permissions={[...permissions]}>
      {children}
    </PermissionProvider>
  );
}
