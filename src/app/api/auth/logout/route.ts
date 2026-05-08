import { type NextRequest, NextResponse } from "next/server";
import {
  BE_API_URL,
  USE_SECURE_COOKIE,
  getKeycloakConfig,
  isAuthEnabled,
} from "@/lib/config";
import { apiRoutes, beApiRoutes, pageRoutes } from "@/lib/const/pages";
import { getSession, sessionOptions } from "@/lib/open-id";
import { getBaseUrl } from "@/lib/url";

const FETCH_TIMEOUT_MS = 10_000;

async function logoutFromBackend(
  accessToken: string,
  refreshToken: string,
): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(`${BE_API_URL}${beApiRoutes.auth.logout}`, {
      body: JSON.stringify({ refreshToken }),
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: controller.signal,
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as { isSuccess?: boolean };
    return payload.isSuccess === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl(request);
  const session = await getSession();
  const accessToken = session.accessToken;
  const idToken = session.idToken;
  const refreshToken = session.refreshToken;

  if (accessToken && refreshToken) {
    await logoutFromBackend(accessToken, refreshToken);
  }

  session.destroy();
  await session.save();

  if (!isAuthEnabled) {
    const response = NextResponse.redirect(new URL(pageRoutes.home, baseUrl));
    response.cookies.delete(sessionOptions.cookieName);
    return response;
  }

  const keycloak = getKeycloakConfig(baseUrl);
  if (!keycloak) {
    const response = NextResponse.redirect(new URL(pageRoutes.home, baseUrl));
    response.cookies.delete(sessionOptions.cookieName);
    return response;
  }

  const reLoginUrl = new URL(apiRoutes.login, baseUrl);
  reLoginUrl.searchParams.set("returnUrl", pageRoutes.home);
  reLoginUrl.searchParams.set("prompt", "login");
  const logoutUrl = new URL(`${keycloak.url}/protocol/openid-connect/logout`);
  logoutUrl.searchParams.set("client_id", keycloak.clientId);
  logoutUrl.searchParams.set("post_logout_redirect_uri", reLoginUrl.toString());
  if (idToken) {
    logoutUrl.searchParams.set("id_token_hint", idToken);
  }

  const response = NextResponse.redirect(logoutUrl);
  response.cookies.set(sessionOptions.cookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: USE_SECURE_COOKIE,
  });

  return response;
}
