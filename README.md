# CAFBEX — Canada–Africa Farmers Business Exchange

Next.js website and admin portal for CAFBEX. Content is stored in MongoDB and managed through `/admin`.

## Stack

- Next.js 16 (App Router)
- MongoDB + Mongoose
- NextAuth v5 (credentials)
- Cloudinary (optional media uploads)
- Resend (optional transactional email)
- TipTap, dnd-kit, Recharts, Sonner

## Prerequisites

- Node.js 20+
- MongoDB running locally (or a remote URI)
- [MongoDB Compass](https://www.mongodb.com/products/compass) recommended for browsing data

## 1. Install

```bash
npm install
```

## 2. Environment

```bash
cp .env.example .env.local
```

A starter `.env.local` is included for local MongoDB Compass:

```
MONGODB_URI=mongodb://127.0.0.1:27017/cafbex
```

Generate a strong `AUTH_SECRET` for any shared or production environment.

## 3. MongoDB Compass setup

1. Install and open MongoDB Compass.
2. Connect to `mongodb://127.0.0.1:27017` (start local `mongod` if needed).
3. The `cafbex` database is created automatically on first seed/connect.
4. After seeding, browse collections such as `pages`, `services`, `adminusers`, `sitesettings`.

## 4. Seed the database

```bash
npm run seed
```

This seeds:

| Content | Notes |
|---|---|
| Admin user | From `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| Site settings | Org info + postal/secondary-email verification warnings |
| Public pages | Structured sections (home, about, services, …) |
| 8 services | Full content, active |
| Activities | Active formats with careful language |
| FAQs | By category |
| Mission / vision | In settings |
| 5 blog posts | **Draft only** |
| Products | **Inactive** drafts |
| Team | **Draft** placeholders |
| Pricing | Contact-for-details categories |

**Not seeded as published:** events, testimonials, partners.

Default login (unless you changed env):

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: `admin@cafbex.org`
- Password: `ChangeMeNow123!`

Change the password after first login in production.

## 5. Image uploads (Vercel-safe)

Admin image uploads are stored **in MongoDB** (not the local filesystem) and served from `/api/uploads/{folder}/{filename}`.

- Works on localhost and Vercel (no Cloudinary required)
- Folders: `pages`, `products`, `gallery`, `misc`
- Max size ~4.5MB (client-side compression before upload)
- Use the same `MONGODB_URI` (Atlas recommended for production) so images survive redeploys

Legacy `/uploads/...` disk paths are ignored on the storefront and fall back to a static placeholder.

## 6. Cloudinary (optional)

1. Create a Cloudinary account and upload preset/folder as needed.
2. Set in `.env.local`:

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
```

3. Without Cloudinary, the Media admin page still accepts pasted image URLs.

## 6. Email / Resend (optional)

```
RESEND_API_KEY=...
EMAIL_FROM=CAFBEX <you@yourdomain.com>
CONTACT_TO=...
BOOKING_TO=...
```

Public contact/booking forms use these when configured.

## 7. Images (your photos)

Branded SVG placeholders live under `public/images/`. Replace them with your own JPG/WebP/PNG using the same filenames (see `public/images/README.md`). Until real photos are added, the UI falls back to SVG placeholders automatically.

Custom SVG logo: `src/components/brand/CafbexLogo.tsx` (maple + Africa + seed mark).

## 8. Develop

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## 8. Build & start

```bash
npm run build
npm start
```

Other scripts:

```bash
npm run lint
npm run typecheck
npm run seed
```

## Admin portal

Protected by NextAuth credentials middleware on `/admin/*` (except `/admin/login`).

Includes:

- Dashboard with live MongoDB stats + booking trend chart
- Pages (section editor, reorder, SEO, draft/publish, revalidate)
- Services, activities, events, gallery, team
- Bookings & inquiries (status + notes)
- Products, pricing, testimonials (approve/feature)
- Blogs (TipTap editor)
- Media library
- Site settings (including verification flags)

## Deploy

1. Set production env vars (`MONGODB_URI`, `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, Cloudinary, Resend).
2. Run `npm run seed` once against the production database (or migrate content carefully).
3. Deploy with `npm run build` on your host (Vercel, Node server, etc.).
4. Ensure `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` match the public origin.

## Brand

- Forest `#0B3D2E`
- Agri `#1B6B45`
- Lime `#C6FF4E`

Admin UI uses a deep forest theme with lime accents.
