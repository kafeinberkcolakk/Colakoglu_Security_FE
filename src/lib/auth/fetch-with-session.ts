import { refreshSession } from "@/lib/auth/refresh-session";
import { getSession } from "@/lib/open-id";

const MS_PER_SECOND = 1000;
const REFRESH_BUFFER_SECONDS = 180;
const REFRESH_BUFFER_MS = REFRESH_BUFFER_SECONDS * MS_PER_SECOND;

export async function fetchWithSessionAuth(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  let session = await getSession();

  const now = Date.now();
  const expiresAt = session.expiresAt ?? 0;
  const tokenMissing = !session.accessToken;
  const tokenExpiringSoon =
    expiresAt > 0 && expiresAt <= now + REFRESH_BUFFER_MS;

  if (tokenMissing || tokenExpiringSoon) {
    await refreshSession();
    session = await getSession();
  }

  const headers = new Headers(init?.headers);

  if (session.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  return fetch(url, { ...init, headers });
}
