import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { config } from "../config.js";

const SEVEN_DAYS_SEC = 60 * 60 * 24 * 7;

const cookieBaseOptions = () => {
  return {
    httpOnly: true,
    path: "/",
  } as const;
};

export const setSessionCookie = (c: Context, token: string): void => {
  setCookie(c, config.sessionCookieName, token, {
    ...cookieBaseOptions(),
    maxAge: SEVEN_DAYS_SEC,
  });
};

export const clearSessionCookie = (c: Context): void => {
  deleteCookie(c, config.sessionCookieName, {
    ...cookieBaseOptions(),
    maxAge: 0,
  });
};

export const getSessionTokenFromRequest = (c: Context): string | undefined => {
  const fromCookie = getCookie(c, config.sessionCookieName);
  if (fromCookie) {
    return fromCookie;
  }

  const header = c.req.header("Authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }

  return undefined;
};
