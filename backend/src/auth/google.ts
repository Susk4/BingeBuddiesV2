import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import type { AuthTokenPayload, PublicUser, SessionClaims } from "@binge-buddies/shared";

const SESSION_TTL = "7d";
const OAUTH_STATE_TTL = "10m";

const getOAuthClient = (): OAuth2Client => {
  return new OAuth2Client(
    config.googleClientId,
    config.googleClientSecret,
    config.googleRedirectUri,
  );
};

export const createGoogleAuthUrl = (): { url: string; state: string } => {
  const state = jwt.sign(
    { purpose: "google_oauth" },
    config.jwtSecret,
    { expiresIn: OAUTH_STATE_TTL },
  );

  const client = getOAuthClient();
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    include_granted_scopes: true,
    prompt: "consent",
    state,
  });

  return { url, state };
};

export const verifyOAuthState = (state: string): void => {
  jwt.verify(state, config.jwtSecret);
};

/** Exchange authorization code (confidential client) for a verified Google profile. */
export const exchangeAuthorizationCode = async (
  code: string,
): Promise<AuthTokenPayload> => {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.id_token) {
    throw new Error("Google did not return an id_token");
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: config.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) {
    throw new Error("Invalid Google token payload");
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email,
    picture: payload.picture,
  };
};

export const toPublicUser = (profile: AuthTokenPayload): PublicUser => {
  return {
    uid: profile.sub,
    email: profile.email,
    displayName: profile.name,
    photoURL: profile.picture ?? null,
  };
};

export const issueSessionToken = (claims: SessionClaims): string => {
  return jwt.sign(claims, config.jwtSecret, { expiresIn: SESSION_TTL });
};

export const verifySessionToken = (token: string): SessionClaims => {
  return jwt.verify(token, config.jwtSecret) as SessionClaims;
};
