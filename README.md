# Binge Buddies

**Find your next binge-worthy movie — with friends.**

Discover titles from [TMDB](https://www.themoviedb.org/), swipe through picks with filters you care about, save likes, and connect with buddies to compare tastes.

---

## Features

- **Discover** — genre, streaming provider, and release-year filters powered by TMDB
- **Vote** — like or pass on movies; revisit your list anytime
- **Sign in** — Google OAuth with session cookies
- **Social** — contacts and groups to share the hunt with friends

## Stack

| Layer    | Tech |
| -------- | ---- |
| Web      | Next.js, React, Tailwind CSS, TanStack Query |
| API      | Hono on Node (`backend/src/index.ts`) |
| Data     | SQLite / libSQL (Turso), Drizzle ORM |
| Shared   | `@binge-buddies/shared` types & constants |

## Monorepo layout

```
├── web/                 # Next.js app (port 3000) — deploy to Vercel
├── backend/             # Hono API (port 4000) — run on your own host
└── packages/shared/     # Shared TypeScript package
```

## Getting started

**Requirements:** Node.js 18+, [pnpm](https://pnpm.io/)

```bash
pnpm install
```

Copy environment files and fill in secrets (Google OAuth, TMDB, JWT):

```bash
cp backend/.env.example backend/.env
cp web/.env.example web/.env.local   # optional; defaults work for local dev
```

Run database migrations:

```bash
pnpm --filter @binge-buddies/backend db:migrate
```

Start the API and web app together:

```bash
pnpm dev:all
```

| URL | Service |
| --- | ------- |
| http://localhost:3000 | Web |
| http://localhost:4000 | API (direct; web proxies in dev) |

### Useful scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev:web` | Web only |
| `pnpm dev:api` | API only |
| `pnpm dev:stop` | Free ports 3000, 3001, 4000 |
| `pnpm build` | Build shared, backend, and web |
| `pnpm --filter @binge-buddies/backend db:studio` | Drizzle Studio |

## Deploying the web (Vercel)

**One Vercel project** — Root Directory **`web`**, enable **Include source files outside the Root Directory** (for `packages/shared`).

Build settings come from `web/vercel.json` (install at repo root, build shared + web).

| Variable | Purpose |
| -------- | ------- |
| `API_PROXY_TARGET` | **Required in production.** Origin of your Hono API, e.g. `https://api.example.com` (no trailing slash). Next rewrites `/auth`, `/api`, and `/health` to this host. |

Leave `NEXT_PUBLIC_API_URL` empty so the browser uses same-origin paths and cookies stay on the web domain.

## Hosting the API (any Node provider)

The API is a normal long-running Node process, not a Vercel serverless bundle.

```bash
pnpm install
pnpm --filter @binge-buddies/shared build
pnpm --filter @binge-buddies/backend build
cd backend && node dist/index.js
```

Set env from `backend/.env.example`. For production:

| Variable | Notes |
| -------- | ----- |
| `DATABASE_URL` / `LIBSQL_AUTH_TOKEN` | Turso (or remote libSQL); file SQLite is fine for a single VM |
| `CORS_ORIGIN` | Your web origin, e.g. `https://your-app.vercel.app` (include `https://`) |
| `GOOGLE_REDIRECT_URI` | Web callback URL, e.g. `https://your-app.vercel.app/auth/google/callback` (must match Google Console) |
| `PORT` | Often set by the host (Railway, Fly, Render, etc.) |

Migrations run automatically on API startup when `backend/drizzle` is present.

Point your web app’s `API_PROXY_TARGET` (Vercel or Railway) at this deployment’s public URL.

## Railway (API + web)

Two **services**, same GitHub repo. **Root Directory must be empty** (repo root) on both — not `web/` or `backend/`. Otherwise install uses npm and `workspace:*` breaks.

| | **API service** | **Web service** |
| --- | --- | --- |
| **Railway config file** (Settings → Config) | `/railway.api.json` | `/railway.web.json` |
| **Railpack config** (service variable) | *(default)* `railpack.json` | **`RAILPACK_CONFIG_FILE`** = `railpack.web.json` |
| **Build** (via Railpack) | `pnpm run build:api` | `pnpm run build:web` |
| **Start** | `node backend/dist/index.js` | `pnpm --filter @binge-buddies/web start` |

**API env** — from `backend/.env.example` (Turso, Google, JWT, etc.). Set `CORS_ORIGIN` and `GOOGLE_REDIRECT_URI` to the **web** public URL.

**Web env**

| Variable | Value |
| -------- | ----- |
| `API_PROXY_TARGET` | API public URL (no trailing slash) |
| `RAILPACK_CONFIG_FILE` | `railpack.web.json` (required so Railpack does not use API `railpack.json`) |

`HOSTNAME=0.0.0.0` for Next is set in `railpack.web.json` / `railway.web.json`. Railway sets `PORT`.

**Files**

| File | Role |
| ---- | ---- |
| `railpack.json` | Default Railpack plan → **API** |
| `railpack.web.json` | Railpack plan → **web** (via `RAILPACK_CONFIG_FILE`) |
| `railway.api.json` | Railway UI config for API service |
| `railway.web.json` | Railway UI config for web service |

Do not set a custom **Build command** in the Railway dashboard unless debugging; it overrides Railpack and is easy to get wrong.

---

Built for people who take “one more episode” a little too seriously.
