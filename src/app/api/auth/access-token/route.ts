import { NextResponse } from "next/server";
import { refreshSession } from "@/lib/auth/refresh-session";
import { getSession } from "@/lib/open-id";

const MS_PER_SECOND = 1000;
const REFRESH_BUFFER_MS = 60 * MS_PER_SECOND;

async function resolveAccessToken() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return null;
  }

  const now = Date.now();
  const expiresAt = session.expiresAt ?? 0;
  const needsRefresh = expiresAt > 0 && expiresAt <= now + REFRESH_BUFFER_MS;

  if (session.accessToken && !needsRefresh) {
    return {
      accessToken: session.accessToken,
      expiresAt: session.expiresAt ?? null,
      refreshed: false,
    };
  }

  const refreshed = await refreshSession();
  if (!refreshed?.accessToken) {
    return null;
  }

  return {
    accessToken: refreshed.accessToken,
    expiresAt: refreshed.expiresAt ?? null,
    refreshed: true,
  };
}

export async function GET() {
  const token = await resolveAccessToken();
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json(
    { ...token, ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
