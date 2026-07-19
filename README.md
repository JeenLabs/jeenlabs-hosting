# JeenLabs Hosting

White-label cloud hosting platform (Contabo-backed). Monorepo: Next.js web, NestJS API, BullMQ worker.

## Structure

```
apps/web      Next.js (storefront + customer + admin UI) — scaffolded
apps/api      NestJS API + Better Auth
apps/worker   BullMQ background jobs
packages/*    Shared types, db, clients, queue, config
docker/       Compose files for app and data tiers
```

## Prerequisites

- Node.js 22 or 24 (see `.nvmrc`; engines allow both)
- pnpm
- Docker (local Postgres/Redis via `docker/docker-compose.dev.yml`)

## Quick start

```bash
cp .env.example .env
# set BETTER_AUTH_SECRET to a random 32+ char string
docker compose -f docker/docker-compose.dev.yml up -d
pnpm install
pnpm --filter @app/db exec prisma migrate deploy
pnpm --filter @app/db run seed
pnpm --filter @app/api dev
# optional: pnpm --filter @app/worker dev
```

- API: `http://localhost:4000`
- Better Auth: `http://localhost:4000/api/auth/*`
- Health: `GET /health` · Ready: `GET /ready`
- Session check: `GET /api/v1/me` (requires auth cookie)

## Quality gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Commits must use Conventional Commits with `git commit -s`.
