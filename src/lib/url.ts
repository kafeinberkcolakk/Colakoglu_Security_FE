import type { NextRequest } from "next/server";
import { ORIGIN } from "@/lib/config";

export function getBaseUrl(request?: NextRequest): URL {
  if (ORIGIN) {
    return new URL(ORIGIN);
  }

  const host =
    request?.headers.get("x-forwarded-host") ?? request?.headers.get("host");
  const protocol = request?.headers.get("x-forwarded-proto") ?? "http";

  if (host) {
    return new URL(`${protocol}://${host}`);
  }

  return new URL("http://localhost:3000");
}
