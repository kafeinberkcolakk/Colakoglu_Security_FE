import { getIronSession } from "iron-session";
import { type NextRequest, NextResponse } from "next/server";
import { isAuthEnabled } from "./lib/config";
import { apiRoutes } from "./lib/const/pages";
import { type SessionData, sessionOptions } from "./lib/open-id";
import { getBaseUrl } from "./lib/url";

export async function proxy(request: NextRequest) {
  if (!isAuthEnabled) {
    return NextResponse.next();
  }

  const baseUrl = getBaseUrl(request);
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(
    request,
    response,
    sessionOptions,
  );

  if (!session.isLoggedIn || !session.accessToken) {
    const rawPath =
      request.nextUrl.pathname + request.nextUrl.search + request.nextUrl.hash;
    const loginUrl = new URL(apiRoutes.login, baseUrl);
    loginUrl.searchParams.set("returnUrl", rawPath);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    {
      missing: [{ key: "next-action", type: "header" }],
      source: "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
    },
  ],
};
