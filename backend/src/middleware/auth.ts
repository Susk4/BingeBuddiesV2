import { createMiddleware } from "hono/factory";
import { verifySessionToken } from "../auth/google.js";
import { getSessionTokenFromRequest } from "../lib/sessionCookie.js";
import type { SessionClaims } from "@binge-buddies/shared";

export type AuthVariables = {
  auth: SessionClaims;
};

export const requireAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const token = getSessionTokenFromRequest(c);

    if (!token) {
      return c.json({ error: "Missing session" }, 401);
    }

    try {
      const claims = verifySessionToken(token);
      c.set("auth", claims);
      await next();
    } catch {
      return c.json({ error: "Invalid or expired session" }, 401);
    }
  },
);
