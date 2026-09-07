# Backend Status — Ready for Frontend Integration

**Status:** ✅ Backend deployed and verified working in production.
**Date:** 2026-09-07

## Production API base URL

```
https://petraportfoliobackend.vercel.app
```

Use this exact domain for `NEXT_PUBLIC_API_URL` on the frontend. Do **not** use a
deployment-specific URL (one containing a random hash, e.g. `...-jp5k3ncmq-....vercel.app`)
— those are protected by Vercel Authentication/SSO and will reject normal API requests
with a 401.

## What was fixed / set up

- Neon PostgreSQL database provisioned and connected (`DATABASE_URL`).
- `JWT_SECRET` and `FRONTEND_URL` environment variables configured in Vercel
  (Production environment) — this is what was previously missing and causing every
  request to fail with 500.
- Prisma schema pushed to the database (`Admin`, `Technology`, `Project` tables exist).
- Single admin account seeded.
- Verified end-to-end in production:
  - `GET /api/health` → `{"status":"ok"}`
  - `POST /api/auth/login` → returns a valid JWT `token` + `admin` object

## CORS

CORS on the backend is locked to the single origin in `FRONTEND_URL`. If the frontend's
production domain changes (e.g. custom domain instead of the default `*.vercel.app`),
`FRONTEND_URL` must be updated in the backend's Vercel env vars and redeployed, or
requests from the frontend will be blocked by CORS.

## Data state

`Technology` and `Project` tables exist but are **empty** — the public GET endpoints
will return `[]` until entries are added through the admin-authenticated endpoints
(or manually via Prisma Studio). This is expected; it's not a bug on either side.

## API contract

Full endpoint reference: source of truth is [`README.md`](./README.md) in this repo.
Summary:

### Auth

| Method | Path               | Auth | Body                    |
| ------ | ------------------ | ---- | ------------------------ |
| POST   | `/api/auth/login`  | -    | `{ email, password }`   |

Returns `{ token, admin }`. Send `token` as `Authorization: Bearer <token>` on any
admin (write) request below.

### Technologies (`/api/technologies`)

| Method | Path                     | Auth   | Body                                                  |
| ------ | ------------------------ | ------ | ------------------------------------------------------ |
| GET    | `/api/technologies`      | Public | -                                                       |
| POST   | `/api/technologies`      | Admin  | `{ name, category: "GENERAL"\|"AI", icon?, order? }`   |
| PUT    | `/api/technologies/:id`  | Admin  | same fields, all optional                               |
| DELETE | `/api/technologies/:id`  | Admin  | -                                                        |

### Projects & Kompetisi (`/api/projects`)

| Method | Path                | Auth   | Body / Query                                                                                                     |
| ------ | ------------------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/projects`     | Public | Optional query `?type=PROJECT` or `?type=COMPETITION`                                                                |
| POST   | `/api/projects`     | Admin  | `{ title, description, type: "PROJECT"\|"COMPETITION", techStack: string[], demoUrl?, repoUrl?, imageUrl?, result?, year?, order? }` |
| PUT    | `/api/projects/:id` | Admin  | same fields, all optional                                                                                             |
| DELETE | `/api/projects/:id` | Admin  | -                                                                                                                      |

### Health check

`GET /api/health` → `{ status: "ok" }`

## Next steps on the frontend

1. Set `NEXT_PUBLIC_API_URL=https://petraportfoliobackend.vercel.app` in the frontend's env config.
2. Build the admin login form against `POST /api/auth/login`, store the returned JWT
   (e.g. in memory or an httpOnly-equivalent client strategy), and attach it as
   `Authorization: Bearer <token>` for admin CRUD calls.
3. Wire the **Teknologi** section to `GET /api/technologies` and the
   **Project dan Kompetisi** section to `GET /api/projects`.
4. Since both tables are currently empty, use the admin panel (once built) or Prisma
   Studio to add a few real entries for visual testing.
