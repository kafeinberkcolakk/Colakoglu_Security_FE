import { getKeycloakConfig, isAuthEnabled } from "@/lib/config";
import { getSession } from "@/lib/open-id";
import { getBaseUrl } from "@/lib/url";

const DEFAULT_EXPIRES_IN_SECONDS = 300;
const FETCH_TIMEOUT_MS = 10_000;
const MS_PER_SECOND = 1000;

export type RefreshResult = {
  accessToken: string;
  expiresAt?: number;
  refreshToken?: string;
};

let refreshPromise: Promise<RefreshResult | null> | null = null;

async function clearSession() {
  const session = await getSession();
  session.isLoggedIn = false;
  session.accessToken = undefined;
  session.refreshToken = undefined;
  session.idToken = undefined;
  session.expiresAt = undefined;
  session.locale = undefined;
  session.state = undefined;
  await session.save();
}

function resolveUsableTokenFallback(session: {
  accessToken?: string;
  expiresAt?: number;
  refreshToken?: string;
}): RefreshResult | null {
  const accessToken = session.accessToken;
  const expiresAt = session.expiresAt ?? 0;

  if (!accessToken) {
    return null;
  }

  if (expiresAt > 0 && expiresAt <= Date.now()) {
    return null;
  }

  return {
    accessToken,
    expiresAt: session.expiresAt,
    refreshToken: session.refreshToken,
  };
}

export async function refreshSession(): Promise<RefreshResult | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = executeRefresh();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function executeRefresh(): Promise<RefreshResult | null> {
  if (!isAuthEnabled) {
    return null;
  }

  const session = await getSession();
  const fallbackToken = resolveUsableTokenFallback(session);
  if (!session.refreshToken) {
    if (fallbackToken) {
      return fallbackToken;
    }
    await clearSession();
    return null;
  }

  const keycloak = getKeycloakConfig(getBaseUrl());
  if (!keycloak) {
    await clearSession();
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const body = new URLSearchParams([
      ["client_id", keycloak.clientId],
      ["grant_type", "refresh_token"],
      ["refresh_token", session.refreshToken],
    ]);

    const response = await fetch(keycloak.tokenEndpoint, {
      body: body.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      signal: controller.signal,
    });

    if (!response.ok) {
      if (fallbackToken) {
        return fallbackToken;
      }
      await clearSession();
      return null;
    }

    const data = await response.json();
    if (!data?.access_token) {
      if (fallbackToken) {
        return fallbackToken;
      }
      await clearSession();
      return null;
    }

    const expiresInSeconds = data.expires_in ?? DEFAULT_EXPIRES_IN_SECONDS;
    const expiresAt = Date.now() + expiresInSeconds * MS_PER_SECOND;
    const freshSession = await getSession();
    freshSession.accessToken = data.access_token;
    freshSession.expiresAt = expiresAt;
    freshSession.isLoggedIn = true;

    if (data.refresh_token) {
      freshSession.refreshToken = data.refresh_token;
    }

    await freshSession.save();

    return {
      accessToken: data.access_token,
      expiresAt,
      refreshToken: freshSession.refreshToken,
    };
  } catch {
    if (fallbackToken) {
      return fallbackToken;
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
