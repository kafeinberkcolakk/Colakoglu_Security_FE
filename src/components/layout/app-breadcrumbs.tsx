"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { pageRoutes } from "@/lib/const/pages";

type BreadcrumbEntry = {
  key: string;
  label: string;
  url?: string;
};

const routeDefinitions = [
  { key: "dashboard", path: pageRoutes.home },
  { key: "data", path: pageRoutes.data },
  { key: "flows", path: pageRoutes.flows },
  { key: "profile", path: pageRoutes.profile },
];

const normalizePath = (path?: string) => {
  if (!path || path === "/") {
    return "/";
  }

  return path.endsWith("/") ? path.slice(0, -1) : path;
};

export function AppBreadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations("sidebar.menu");

  const trail = useMemo(() => {
    const normalizedPath = normalizePath(pathname);
    const breadcrumbs: BreadcrumbEntry[] = routeDefinitions
      .filter(
        (entry) =>
          normalizedPath === normalizePath(entry.path) ||
          normalizedPath.startsWith(`${normalizePath(entry.path)}/`) ||
          entry.path === "/",
      )
      .sort((a, b) => a.path.length - b.path.length)
      .map((entry) => ({
        key: entry.key,
        label: t(entry.key),
        url: normalizePath(entry.path),
      }));

    const last = breadcrumbs.at(-1);
    if (last) {
      last.url = undefined;
    }

    return breadcrumbs;
  }, [pathname, t]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {trail.map((entry, index) => {
          const isLast = index === trail.length - 1;
          const content = isLast ? (
            <BreadcrumbPage>{entry.label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={entry.url ?? "#"}>
              {entry.label}
            </BreadcrumbLink>
          );

          return [
            <BreadcrumbItem key={`${entry.key}-${index}`}>
              {content}
            </BreadcrumbItem>,
            isLast ? null : (
              <BreadcrumbSeparator key={`sep-${entry.key}-${index}`} />
            ),
          ].filter(Boolean);
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
