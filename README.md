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

---

Built for people who take “one more episode” a little too seriously.
