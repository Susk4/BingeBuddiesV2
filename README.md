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
| API      | Hono (Node + Vercel handler) |
| Data     | SQLite / libSQL, Drizzle ORM |
| Shared   | `@binge-buddies/shared` types & constants |

## Monorepo layout

```
├── web/                 # Next.js app (port 3000)
├── backend/             # Hono API (port 4000 in local dev)
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

## Deploying to Vercel

Two **Vercel projects**, same Git repo. Most behavior is in each app’s **`vercel.json`**; you only set a few things in the dashboard once per project.

### What `vercel.json` does (no duplication)

| File | Handles |
| ---- | ------- |
| `backend/vercel.json` | Monorepo `pnpm install`, **shared + backend** build, Hono rewrites, ship `drizzle/**` with the serverless function |
| `web/vercel.json` | Monorepo `pnpm install`, **shared + web** build (Next only) |

`packages/shared` is built on **each** deploy and linked via `workspace:*` — not a third Vercel project.

### Dashboard (once per project)

Create two projects from the same repository:

| | **API** | **Web** |
|---|--------|--------|
| **Root Directory** | `backend` | `web` |
| **Include source files outside Root Directory** | On | On |

Vercel reads `vercel.json` from that root folder automatically. You do **not** put a single root `vercel.json` at the repo top for both apps.

### Environment variables

**API project** — from `backend/.env.example` (Turso, Google OAuth, JWT, `CORS_ORIGIN` = your web URL, etc.). `GOOGLE_REDIRECT_URI` must be the **web** callback (e.g. `https://your-app.vercel.app/auth/google/callback`).

**Web project** — set at build time (Next rewrites):

| Variable | Purpose |
| -------- | ------- |
| `API_PROXY_TARGET` | API deployment origin, e.g. `https://your-api.vercel.app` (no trailing slash) |

Optional: link projects in `web/vercel.json` with [`relatedProjects`](https://vercel.com/docs/monorepos#how-to-link-projects-together-in-a-monorepo) and resolve the API host via `@vercel/related-projects` instead of a manual URL.

The browser still calls same-origin `/api/...`; Next proxies to the Hono deployment.

---

Built for people who take “one more episode” a little too seriously.
