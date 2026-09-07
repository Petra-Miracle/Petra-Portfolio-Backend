# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

This is the **backend API** for Petra's portfolio site — a single-page portfolio built to show programming skills to startups. The system is split across two separate repositories/VS Code windows, each owned by a different agent:

- **This repo** (`Petra-Portfolio-Backend`) — Express/TypeScript API, Prisma + PostgreSQL (Neon), JWT admin auth. Owned by Claude: all backend logic, data model, and API contract decisions happen here.
- **Frontend repo** (`Petra-Portfolio`, sibling directory `D:\Petra-Portfolio`, GitHub `Petra-Miracle/Petra-Portfolio`) — Next.js/TypeScript/Tailwind/HeroUI/Base UI, built by a separate AI agent (OpenCode) from prompts the user copies over manually. It consumes this API as a pure client; it has no knowledge of this repo's internals beyond the HTTP contract.

The portfolio's public page has five sections in order: Hero (photo + name), Pengenalan (intro), Teknologi (tech stack, split into `GENERAL` and `AI` categories), Project dan Kompetisi (projects and competitions), Footer. The **Teknologi** and **Project dan Kompetisi** sections are backed by this API so the user can add/edit/delete entries from an admin UI without touching code — that admin CRUD is the main reason this backend exists.

Both repos deploy to Vercel as **separate projects**, connected only via HTTP (`NEXT_PUBLIC_API_URL` on the frontend side, `FRONTEND_URL` for CORS on this side).

## Commands

```bash
npm install          # install deps (postinstall runs `prisma generate` automatically)
npm run dev           # tsx watch — local dev server on $PORT (default 4000)
npm run build          # tsc compile to dist/ (not required for Vercel deploy, useful for local prod testing)
npm run start           # run compiled server from dist/ (after npm run build)

npm run prisma:generate  # regenerate Prisma client after schema.prisma changes
npm run prisma:push       # push schema.prisma to the DATABASE_URL (no migration files — this project uses `db push`, not `migrate`)
npm run prisma:studio      # open Prisma Studio against DATABASE_URL

npm run seed          # upsert the single admin account from ADMIN_EMAIL/ADMIN_PASSWORD env vars
```

There is no test suite and no lint script configured in this project — don't assume one exists.

Required env vars (see `.env.example`): `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `PORT`, and (seed-only) `ADMIN_EMAIL`/`ADMIN_PASSWORD`. `src/config/env.ts` validates these with Zod at startup and will throw immediately if any required var is missing — check there first when debugging "won't start" issues.

## Architecture

**Request flow**: `api/index.ts` (Vercel serverless entry) and `src/server.ts` (local `app.listen`) both just import and expose the same `src/app.ts` Express instance — all real wiring lives in `app.ts`, not in either entry point. `vercel.json` rewrites every path to `/api/index`, so in production the whole Express app runs behind one serverless function; there's no per-route function splitting.

Each resource follows the same three-layer pattern — keep new resources consistent with it:

```
routes/*.routes.ts        → wires HTTP verb + path to a controller, applies requireAdmin where writes need auth
controllers/*.controller.ts → parses/validates req.body with a Zod schema, calls prisma, shapes the response
validators/*.schema.ts     → Zod schemas per resource (input schema + a `.partial()` update variant)
```

Controllers are wrapped in `asyncHandler` (`src/utils/asyncHandler.ts`) so thrown errors — including `ZodError` from `.parse()` — flow to the centralized `errorHandler` middleware (`src/middleware/errorHandler.ts`) rather than needing try/catch in every controller. `ZodError` is special-cased there into a 400 with `.flatten()` details; everything else becomes a 500.

**Auth**: `requireAdmin` (`src/middleware/auth.ts`) reads `Authorization: Bearer <token>`, verifies it with `verifyAdminToken` (`src/utils/jwt.ts`), and attaches the decoded payload to `req.admin`. There is exactly one admin account (see `prisma/seed.ts` — upserts from env vars, no signup flow, no roles/permissions system). Read endpoints (`GET`) are public; writes (`POST`/`PUT`/`DELETE`) require `requireAdmin`. Follow this public-read/admin-write split for any new resource.

**Prisma client**: `src/lib/prisma.ts` caches the client on `globalThis` outside production to avoid exhausting connections across hot reloads — reuse this singleton rather than instantiating `new PrismaClient()` elsewhere.

**Uploads**: `/api/uploads` (`src/routes/uploads.routes.ts`) is the one route that breaks the standard JSON/Zod pattern above — it takes `multipart/form-data` via `multer` (memory storage, 5MB limit, image-only, `src/middleware/upload.ts`) and streams the buffer straight to Vercel Blob (`@vercel/blob`'s `put()`), returning `{ url }`. It doesn't touch Prisma at all; the returned URL is meant to be passed as `imageUrl` in a separate `POST`/`PUT /api/projects` call. `MulterError` and the upload's own file-type error are special-cased in `errorHandler.ts` alongside `ZodError`.

**Data model** (`prisma/schema.prisma`):

- `Admin` — single row in practice, email + bcrypt hash.
- `Technology` — `category` enum `GENERAL | AI` (matches the two-column split on the frontend's Teknologi section), `order` for manual sort.
- `Project` — covers both "project" and "kompetisi" entries via `type` enum `PROJECT | COMPETITION`, rather than two separate tables. `techStack` is a plain `String[]` (no relation to `Technology` — free-text tags), `result`/`year` are competition-oriented fields left nullable for plain projects.

Full endpoint list and request/response shapes are documented in `README.md` — treat that as the source of truth for the HTTP contract, and update it whenever a route changes since the frontend agent works from it directly without reading this codebase.
