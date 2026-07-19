# JeenLabs Hosting

White-label cloud hosting platform (Contabo-backed). Monorepo: Next.js web, NestJS API, BullMQ worker.

## Structure

```
apps/web      Next.js (storefront + customer + admin UI)
apps/api      NestJS API + Better Auth
apps/worker   BullMQ background jobs
packages/*    Shared types, db, clients, queue, config
docker/       Compose files for app and data tiers
```

## Prerequisites

- Node.js LTS (see `.nvmrc` once added)
- pnpm
- Docker (local Postgres/Redis)

## Quick start

```bash
pnpm install
pnpm dev
```

Local URLs (after Phase 0 wiring): web `http://localhost:3000`, API `http://localhost:4000`.
