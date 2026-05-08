import { randomUUID } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import {
  USE_SECURE_COOKIE,
  getKeycloakConfig,
  isAuthEnabled,
} from "@/lib/config";
import { getBaseUrl } from "@/lib/url";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const baseUrl = getBaseUrl(request);
  if (!isAuthEnabled) {
    return NextResponse.redirect(new URL("/", baseUrl));
  }

  const keycloak = getKeycloakConfig(baseUrl);
  if (!keycloak) {
    return NextResponse.redirect(new URL("/", baseUrl));
  }

  const state = randomUUID();
  const returnUrl = request.nextUrl.searchParams.get("returnUrl") ?? "";
  const prompt = request.nextUrl.searchParams.get("prompt");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isSecureRequest =
    forwardedProto === "https" ||
    request.nextUrl.protocol === "https" ||
    USE_SECURE_COOKIE;

  const keycloakAuthUrl = new URL(
    `${keycloak.url}/protocol/openid-connect/auth`,
  );
  keycloakAuthUrl.searchParams.set("client_id", keycloak.clientId);
  keycloakAuthUrl.searchParams.set("redirect_uri", keycloak.callbackUrl);
  keycloakAuthUrl.searchParams.set("response_type", "code");
  keycloakAuthUrl.searchParams.set("scope", keycloak.scope);
  keycloakAuthUrl.searchParams.set("state", state);
  if (prompt) {
    keycloakAuthUrl.searchParams.set("prompt", prompt);
    if (prompt === "login") {
      keycloakAuthUrl.searchParams.set("max_age", "0");
    }
  }

  const response = NextResponse.redirect(keycloakAuthUrl.toString());
  const sameSite = isSecureRequest ? "none" : "lax";
  const secure = isSecureRequest;

  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite,
    secure,
  });

  if (returnUrl) {
    response.cookies.set("oauth_return_url", returnUrl, {
      httpOnly: true,
      maxAge: 60 * 10,
      path: "/",
      sameSite,
      secure,
    });
  }

  return response;
}
