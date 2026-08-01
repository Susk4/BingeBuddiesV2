import { Hono } from "hono";
import {
  createGoogleAuthUrl,
  exchangeAuthorizationCode,
  issueSessionToken,
  verifyOAuthState,
  verifySessionToken,
} from "../auth/google.js";
import { config } from "../config.js";
import type { AppDatabase } from "../db/index.js";
import {
  clearSessionCookie,
  getSessionTokenFromRequest,
  setSessionCookie,
} from "../lib/sessionCookie.js";
import { requireAuth, type AuthVariables } from "../middleware/auth.js";
import * as data from "../services/data.js";
import type { UserFilters } from "@binge-buddies/shared";
import { isMovieVote } from "@binge-buddies/shared";

type AuthEnv = { Variables: AuthVariables };

export const createAuthRoutes = (db: AppDatabase) => {
  const app = new Hono<AuthEnv>();

  /** Start confidential OAuth — browser redirect to Google. */
  app.get("/google", (c) => {
    const { url } = createGoogleAuthUrl();
    return c.redirect(url, 302);
  });

  /** Google redirects here with `?code=&state=`; exchange code using client secret. */
  app.get("/google/callback", async (c) => {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const oauthError = c.req.query("error");

    if (oauthError) {
      const target = new URL("/login", config.corsOrigin);
      target.searchParams.set("error", oauthError);
      return c.redirect(target.toString(), 302);
    }

    if (!code || !state) {
      return c.text("Missing code or state", 400);
    }

    try {
      verifyOAuthState(state);
      const profile = await exchangeAuthorizationCode(code);
      const { isNewUser } = await data.upsertUserFromGoogle(db, {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        photoUrl: profile.picture ?? null,
      });

      const accessToken = issueSessionToken({
        uid: profile.sub,
        email: profile.email,
      });

      const target = new URL("/auth/callback", config.corsOrigin);
      target.searchParams.set("isNewUser", isNewUser ? "1" : "0");

      setSessionCookie(c, accessToken);
      return c.redirect(target.toString(), 302);
    } catch (error) {
      console.error("Google OAuth callback failed:", error);
      const target = new URL("/login", config.corsOrigin);
      target.searchParams.set("error", "sign_in_failed");
      return c.redirect(target.toString(), 302);
    }
  });

  app.get("/me", async (c) => {
    const token = getSessionTokenFromRequest(c);
    if (!token) {
      return c.json({ error: "Missing session" }, 401);
    }

    try {
      const claims = verifySessionToken(token);
      const profile = await data.getUserProfile(db, claims.uid);
      if (!profile) {
        return c.json({ error: "User not found" }, 404);
      }
      return c.json({
        user: {
          uid: profile.id,
          email: profile.email,
          displayName: profile.name,
          photoURL: profile.photo_url,
        },
      });
    } catch {
      return c.json({ error: "Invalid or expired session" }, 401);
    }
  });

  app.post("/logout", (c) => {
    clearSessionCookie(c);
    return c.body(null, 204);
  });

  return app;
}

export const createApiRoutes = (db: AppDatabase) => {
  const app = new Hono<AuthEnv>();
  app.use("*", requireAuth);

  app.post("/users/:uid/register", async (c) => {
    const uid = c.req.param("uid");
    if (c.get("auth").uid !== uid) {
      return c.json({ error: "Forbidden" }, 403);
    }
    const body = await c.req.json<{ filters: UserFilters }>();
    await data.registerUserFilters(db, uid, body.filters ?? {});
    return c.body(null, 204);
  });

  app.get("/users/:uid", async (c) => {
    const uid = c.req.param("uid");
    const profile = await data.getUserProfile(db, uid);
    if (!profile) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json(profile);
  });

  app.patch("/users/:uid/filters", async (c) => {
    const uid = c.req.param("uid");
    if (c.get("auth").uid !== uid) {
      return c.json({ error: "Forbidden" }, 403);
    }
    const body = await c.req.json<UserFilters>();
    await data.setUserFilters(db, uid, body);
    return c.body(null, 204);
  });

  app.get("/users/:uid/movies", async (c) => {
    const uid = c.req.param("uid");
    if (c.get("auth").uid !== uid) {
      return c.json({ error: "Forbidden" }, 403);
    }
    const page = Number(c.req.query("page") ?? "1");
    const voteParam = c.req.query("vote") ?? "all";
    const search = c.req.query("q") ?? "";
    const voteFilter: data.UserMoviesVoteFilter =
      voteParam === "all"
        ? "all"
        : isMovieVote(voteParam)
          ? voteParam
          : "all";
    return c.json(
      await data.getUserVotedMoviesPage(db, uid, page, voteFilter, search),
    );
  });

  app.post("/users/:uid/movies", async (c) => {
    const uid = c.req.param("uid");
    if (c.get("auth").uid !== uid) {
      return c.json({ error: "Forbidden" }, 403);
    }
    const body = await c.req.json<{ id: number; vote?: string }>();
    const vote = body.vote ?? "like";
    if (!isMovieVote(vote)) {
      return c.json({ error: "Invalid vote" }, 400);
    }
    await data.recordUserMovieVote(db, uid, Number(body.id), vote);
    return c.body(null, 204);
  });

  app.delete("/users/:uid/movies/:movieId", async (c) => {
    const uid = c.req.param("uid");
    if (c.get("auth").uid !== uid) {
      return c.json({ error: "Forbidden" }, 403);
    }
    const movieId = Number(c.req.param("movieId"));
    await data.deleteMovieFromUser(db, uid, movieId);
    return c.body(null, 204);
  });

  app.get("/contacts", async (c) => {
    const uid = c.get("auth").uid;
    return c.json(await data.getContacts(db, uid));
  });

  app.get("/contacts/possible", async (c) => {
    const uid = c.get("auth").uid;
    return c.json(await data.getPossibleContacts(db, uid));
  });

  app.get("/contacts/requests/incoming", async (c) => {
    const uid = c.get("auth").uid;
    return c.json(await data.getIncomingContactRequests(db, uid));
  });

  app.get("/contacts/requests/sent", async (c) => {
    const uid = c.get("auth").uid;
    return c.json(await data.getSentContactRequests(db, uid));
  });

  app.post("/contacts", async (c) => {
    const uid = c.get("auth").uid;
    const body = await c.req.json<{ contactId: string }>();
    await data.sendContactRequest(db, uid, body.contactId);
    return c.body(null, 204);
  });

  app.patch("/contacts/:id/accept", async (c) => {
    const id = Number(c.req.param("id"));
    await data.acceptContactRequest(db, id);
    return c.body(null, 204);
  });

  app.delete("/contacts/:id", async (c) => {
    const id = Number(c.req.param("id"));
    await data.declineContactRequest(db, id);
    return c.body(null, 204);
  });

  app.get("/groups", async (c) => {
    const uid = c.get("auth").uid;
    return c.json(await data.getGroupsForUser(db, uid));
  });

  app.get("/groups/pending", async (c) => {
    const uid = c.get("auth").uid;
    return c.json(await data.getPendingGroupsForUser(db, uid));
  });

  app.post("/groups", async (c) => {
    const uid = c.get("auth").uid;
    const body = await c.req.json<{
      name: string;
      description: string;
      userIds: string[];
    }>();
    try {
      const id = await data.createGroup(
        db,
        body.name,
        body.description ?? "",
        body.userIds,
        uid,
      );
      return c.json({ id });
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed" },
        400,
      );
    }
  });

  app.delete("/groups/:id", async (c) => {
    const uid = c.get("auth").uid;
    const groupId = c.req.param("id");
    try {
      await data.deleteGroup(db, groupId, uid);
      return c.body(null, 204);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed" },
        400,
      );
    }
  });

  app.post("/groups/:id/leave", async (c) => {
    const uid = c.get("auth").uid;
    const groupId = c.req.param("id");
    try {
      await data.leaveGroup(db, groupId, uid);
      return c.body(null, 204);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed" },
        400,
      );
    }
  });

  app.patch("/groups/:id/accept", async (c) => {
    const uid = c.get("auth").uid;
    const groupId = c.req.param("id");
    try {
      await data.acceptGroupInvite(db, groupId, uid);
      return c.body(null, 204);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed" },
        400,
      );
    }
  });

  app.patch("/groups/:id/decline", async (c) => {
    const uid = c.get("auth").uid;
    const groupId = c.req.param("id");
    try {
      await data.declineGroupInvite(db, groupId, uid);
      return c.body(null, 204);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed" },
        400,
      );
    }
  });

  app.get("/groups/:id/movies", async (c) => {
    const uid = c.get("auth").uid;
    const groupId = c.req.param("id");
    const page = Number(c.req.query("page") ?? "1");
    const result = await data.getGroupMovies(db, groupId, uid, page);
    if ("error" in result) {
      return c.json(result, 400);
    }
    return c.json(result);
  });

  return app;
}
