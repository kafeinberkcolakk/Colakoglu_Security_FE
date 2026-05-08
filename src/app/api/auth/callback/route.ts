import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getKeycloakConfig, isAuthEnabled } from "@/lib/config";
import { pageRoutes } from "@/lib/const/pages";
import { getSession } from "@/lib/open-id";
import { getBaseUrl } from "@/lib/url";

const DEFAULT_EXPIRES_IN_SECONDS = 300;
const MS_PER_SECOND = 1000;
const OAUTH_RETURN_URL_COOKIE = "oauth_return_url";
const OAUTH_STATE_COOKIE = "oauth_state";

function clearOauthCookies(response: NextResponse) {
  response.cookies.delete(OAUTH_RETURN_URL_COOKIE);
  response.cookies.delete(OAUTH_STATE_COOKIE);
}

function redirectToAuthError(baseUrl: URL) {
  const response = NextResponse.redirect(
    new URL(pageRoutes.authError, baseUrl),
  );
  clearOauthCookies(response);
  return response;
}

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl(request);
  const safeHomeUrl = new URL(pageRoutes.home, baseUrl);

  if (!isAuthEnabled) {
    return NextResponse.redirect(safeHomeUrl);
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const providerError = searchParams.get("error");
  const state = searchParams.get("state");
  const cookieStore = await cookies();
  const savedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  const returnUrl = cookieStore.get(OAUTH_RETURN_URL_COOKIE)?.value;
  const safeReturnUrl = returnUrl?.startsWith("/")
    ? returnUrl
    : pageRoutes.home;
  const keycloak = getKeycloakConfig(baseUrl);

  if (providerError) {
    return redirectToAuthError(baseUrl);
  }

  if (!code || !state || !keycloak || state !== savedState) {
    return redirectToAuthError(baseUrl);
  }

  const body = new URLSearchParams([
    ["client_id", keycloak.clientId],
    ["code", code],
    ["grant_type", "authorization_code"],
    ["redirect_uri", keycloak.callbackUrl],
  ]);

  const tokenResponse = await fetch(keycloak.tokenEndpoint, {
    body: body.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!tokenResponse.ok) {
    return redirectToAuthError(baseUrl);
  }

  const tokens = await tokenResponse.json();
  if (!tokens.access_token) {
    return redirectToAuthError(baseUrl);
  }

  const expiresInSeconds = tokens.expires_in ?? DEFAULT_EXPIRES_IN_SECONDS;
  const response = NextResponse.redirect(new URL(safeReturnUrl, baseUrl));
  const session = await getSession();
  session.accessToken = tokens.access_token;
  session.idToken = tokens.id_token;
  session.refreshToken = tokens.refresh_token;
  session.expiresAt = Date.now() + expiresInSeconds * MS_PER_SECOND;
  session.isLoggedIn = true;
  await session.save();
  clearOauthCookies(response);

  return response;
}
