import { NextResponse } from "next/server";
import { refreshSession } from "@/lib/auth/refresh-session";
import { getSession } from "@/lib/open-id";

const MS_PER_SECOND = 1000;
const REFRESH_BUFFER_MS = 60 * MS_PER_SECOND;

export async function POST() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.refreshToken) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const now = Date.now();
  const expiresAt = session.expiresAt ?? 0;
  const needsRefresh = expiresAt > 0 && expiresAt <= now + REFRESH_BUFFER_MS;

  if (session.accessToken && !needsRefresh) {
    return NextResponse.json({
      expiresAt: session.expiresAt ?? null,
      ok: true,
      refreshed: false,
    });
  }

  const refreshed = await refreshSession();
  if (!refreshed?.accessToken) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({
    expiresAt: refreshed.expiresAt ?? null,
    ok: true,
    refreshed: true,
  });
}
