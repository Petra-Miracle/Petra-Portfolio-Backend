# Petra Portfolio — Backend

Express + TypeScript API, Prisma + PostgreSQL (Neon), JWT auth untuk satu admin.
Menyediakan data untuk section **Teknologi yang Digunakan** dan **Project dan Kompetisi**
di frontend (Next.js, dikerjakan terpisah).

## Setup lokal

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` ke `.env` lalu isi:

   - `DATABASE_URL` — connection string dari [Neon](https://neon.tech) (bentuk `postgresql://...?sslmode=require`).
   - `JWT_SECRET` — string acak panjang (misal `openssl rand -hex 32`).
   - `FRONTEND_URL` — origin frontend untuk CORS (`http://localhost:3000` saat dev).
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — hanya dipakai sekali oleh `npm run seed` untuk membuat akun admin.

3. Push schema ke database Neon:

   ```bash
   npm run prisma:push
   ```

4. Buat akun admin (pakai `ADMIN_EMAIL` & `ADMIN_PASSWORD` dari `.env`):

   ```bash
   npm run seed
   ```

5. Jalankan server dev (default port 4000):

   ```bash
   npm run dev
   ```

## Deploy ke Vercel

1. `vercel link` project ini (pilih/buat project baru, terpisah dari frontend).
2. Set environment variables di Vercel dashboard (Settings → Environment Variables):
   `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` (isi dengan domain production frontend).
3. Deploy:

   ```bash
   vercel --prod
   ```

   `vercel.json` mengarahkan semua request ke `api/index.ts`, yang mengekspor Express app langsung
   sebagai serverless function (esbuild bawaan Vercel yang bundle TypeScript-nya, tidak perlu build step manual).

4. Untuk membuat admin di database production, jalankan `npm run seed` secara lokal dengan
   `DATABASE_URL`/`ADMIN_EMAIL`/`ADMIN_PASSWORD` production di `.env` (atau lewat `vercel env pull`).

## API Endpoints

Base URL lokal: `http://localhost:4000`

### Auth

| Method | Path             | Auth | Body                       | Deskripsi                          |
| ------ | ---------------- | ---- | --------------------------- | ----------------------------------- |
| POST   | `/api/auth/login`| -    | `{ email, password }`      | Login admin, return `{ token, admin }` |

Gunakan token di header `Authorization: Bearer <token>` untuk endpoint yang butuh admin.

### Technologies (`/api/technologies`)

| Method | Path                    | Auth  | Body                                                          |
| ------ | ----------------------- | ----- | --------------------------------------------------------------- |
| GET    | `/api/technologies`     | Publik| -                                                                 |
| POST   | `/api/technologies`     | Admin | `{ name, category: "GENERAL"|"AI", icon?, order? }`             |
| PUT    | `/api/technologies/:id` | Admin | field sama, semua opsional                                       |
| DELETE | `/api/technologies/:id` | Admin | -                                                                 |

### Projects & Kompetisi (`/api/projects`)

| Method | Path               | Auth  | Body / Query                                                                                             |
| ------ | ------------------ | ----- | ----------------------------------------------------------------------------------------------------------- |
| GET    | `/api/projects`    | Publik| Query opsional `?type=PROJECT` atau `?type=COMPETITION`                                                     |
| POST   | `/api/projects`    | Admin | `{ title, description, type: "PROJECT"|"COMPETITION", techStack: string[], demoUrl?, repoUrl?, imageUrl?, result?, year?, order? }` |
| PUT    | `/api/projects/:id`| Admin | field sama, semua opsional                                                                                    |
| DELETE | `/api/projects/:id`| Admin | -                                                                                                              |

### Uploads (`/api/uploads`)

| Method | Path           | Auth  | Body                                          |
| ------ | -------------- | ----- | ---------------------------------------------- |
| POST   | `/api/uploads` | Admin | `multipart/form-data`, field name `file` (image, max 5MB) |

Uploads the image to Vercel Blob and returns `{ url }`. Use the returned `url` as `imageUrl` when creating/updating a project — this endpoint doesn't touch the `Project` table itself, it only produces a hosted URL.

Requires `BLOB_READ_WRITE_TOKEN` (see `.env.example`) — connect a Blob store to the project in the Vercel dashboard first.

### Health check

`GET /api/health` → `{ status: "ok" }`
