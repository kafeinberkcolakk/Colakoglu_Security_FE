import type { NextRequest } from "next/server";
import { type ProxyParams, createProxyHandler } from "@/lib/api/proxy-handler";

export const maxDuration = 60;

const proxy = createProxyHandler({ prefix: "api" });

type RouteContext = { params: Promise<ProxyParams> };

export async function DELETE(request: NextRequest, ctx: RouteContext) {
  return proxy(request, ctx.params);
}

export async function GET(request: NextRequest, ctx: RouteContext) {
  return proxy(request, ctx.params);
}

export async function PATCH(request: NextRequest, ctx: RouteContext) {
  return proxy(request, ctx.params);
}

export async function POST(request: NextRequest, ctx: RouteContext) {
  return proxy(request, ctx.params);
}

export async function PUT(request: NextRequest, ctx: RouteContext) {
  return proxy(request, ctx.params);
}
