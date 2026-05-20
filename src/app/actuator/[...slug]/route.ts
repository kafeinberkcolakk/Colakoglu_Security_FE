import type { NextRequest } from "next/server";
import { type ProxyParams, createProxyHandler } from "@/lib/api/proxy-handler";

export const maxDuration = 60;

const proxy = createProxyHandler({ prefix: "actuator" });

type RouteContext = { params: Promise<ProxyParams> };

export async function GET(request: NextRequest, ctx: RouteContext) {
  return proxy(request, ctx.params);
}
