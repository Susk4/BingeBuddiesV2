import "dotenv/config";

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const config = {
  port: Number(process.env.PORT ?? 4000),
  googleClientId: required("GOOGLE_CLIENT_ID"),
  googleClientSecret: required("GOOGLE_CLIENT_SECRET"),
  googleRedirectUri:
    process.env.GOOGLE_REDIRECT_URI ??
    "http://localhost:3000/auth/google/callback",
  jwtSecret: required("JWT_SECRET"),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL ?? "./data/binge.sqlite",
  libsqlAuthToken: process.env.LIBSQL_AUTH_TOKEN?.trim() ?? "",
  sessionCookieName: process.env.SESSION_COOKIE_NAME ?? "bb_session",
};
