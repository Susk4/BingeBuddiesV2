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

Point Vercel `API_PROXY_TARGET` at this deployment’s public URL.

## Hosting the API on Railway

1. **New service** from this repo — leave **Root Directory empty** (repo root), so `pnpm-workspace.yaml` and `@binge-buddies/shared` resolve.
2. Railpack reads **`railpack.json`** at the repo root (build shared + backend, start `node backend/dist/index.js`). Root `package.json` also defines `"start"` as a fallback.
3. **Variables** — copy from `backend/.env.example` (Turso, Google, JWT, `CORS_ORIGIN`, `GOOGLE_REDIRECT_URI`, etc.). Railway sets `PORT` automatically.
4. After deploy, copy the public URL into Vercel **`API_PROXY_TARGET`**.

If build still fails, set in Railway **Settings → Deploy**:
- **Build command:** `pnpm install && pnpm run build:api`
- **Start command:** `node backend/dist/index.js`

---

Built for people who take “one more episode” a little too seriously.
