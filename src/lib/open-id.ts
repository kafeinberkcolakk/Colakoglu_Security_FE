import {
  type IronSession,
  type SessionOptions,
  getIronSession,
} from "iron-session";
import { cookies } from "next/headers";
import type { Locale } from "@/i18n/config";
import { SESSION_HASH, USE_SECURE_COOKIE } from "./config";

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
  locale?: Locale;
  state?: string;
  isLoggedIn: boolean;
}

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const SESSION_TTL_DAYS = 7;
const SESSION_TTL_SECONDS =
  SESSION_TTL_DAYS * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE;

export const sessionOptions: SessionOptions = {
  cookieName: "session",
  cookieOptions: {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: USE_SECURE_COOKIE,
  },
  password: SESSION_HASH,
  ttl: SESSION_TTL_SECONDS,
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStorage = await cookies();
  return getIronSession<SessionData>(cookieStorage, sessionOptions);
}
