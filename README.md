# New Ankur Furnishers — website + CMS

Marketing site and self-serve admin for New Ankur Furnishers, a home-furnishing
business in Patna serving homes, hotels, hospitals, offices and institutions
since 1984.

**Stack:** Next.js 16 (App Router, Cache Components) · Tailwind CSS 4 ·
Supabase (Postgres, Auth, Storage) · Vercel · @vercel/analytics.

## What's in here

- **Public site** — home, philosophy (the five elements), expertise/sectors,
  products/categories, blog, about, contact, plus privacy, terms and a
  thank-you page. Responsive, with a mobile menu and a sticky contact bar.
- **Admin CMS** (`/admin`) — edit every section of the site without touching
  code: settings, page sections, products, expertise, philosophy, blog posts,
  media, and contact enquiries.
- **SEO** — per-page metadata, Open Graph image, generated `robots.txt` and
  `sitemap.xml`, and a branded favicon.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — without Supabase keys the site uses bundled content
npm run dev
```

Without Supabase credentials the site renders the bundled launch content from
`src/content/seed.ts`, so it runs with no backend. The admin needs Supabase.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key (public reads) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (canonical links, sitemap, OG) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; admin tasks and optional scheduled media cleanup |
| `CRON_SECRET` | Secures the daily keep-alive cron route |
| `RESEND_API_KEY` / `ENQUIRY_NOTIFY_EMAIL` / `ENQUIRY_FROM_EMAIL` | Optional email notifications for new enquiries |

## Supabase setup (one time)

1. In the Supabase dashboard open **SQL Editor** and run, in order:
   - `supabase/migrations/20261010000000_init.sql` — tables, row-level security,
     and the `media` storage bucket.
   - `supabase/seed.sql` — launch content (safe to re-run).
2. **Settings → API** — copy the Project URL and anon public key into
   `.env.local` and into Vercel's environment variables.
3. Admin users — create the user under **Authentication → Users**, then
   `insert into public.admins (user_id) values ('<user uuid>');`

To push edited content to an already-seeded database, run
`supabase/content-update.sql` (upserts copy and page sections; safe to re-run).
Both SQL files are regenerated from `src/content/seed.ts` with
`npm run seed:generate`.

## How content flows

- `src/lib/content.ts` reads published content with the anon key. Reads are
  cached and tagged `content`; row-level security restricts the anon key to
  published rows.
- Admin saves call `updateTag("content")` / `revalidateTag("content", "max")`,
  so edits appear on the site within seconds.
- Launch photos live in `public/images/`. Images uploaded through the admin are
  compressed to WebP and stored in the `media` storage bucket.
- **Media → Remove unused files** deletes uploaded images no longer referenced
  anywhere, freeing storage.

## Keep-alive cron

`vercel.json` schedules a daily Vercel Cron that calls `/api/keep-alive`, which
pings Supabase so a free-tier project is not paused for inactivity. With
`CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` set, the same run also sweeps
unused uploaded images (7-day grace).

## Deploy (Vercel)

Pushing to `main` auto-deploys. Set the environment variables above in the
Vercel project. Cron jobs are configured in `vercel.json`.

## Structure

```
src/app/(site)/        public site + legal pages
src/app/admin/         admin CMS (login + panel: settings, pages, products,
                       expertise, philosophy, blog, media, enquiries)
src/app/api/           route handlers (keep-alive cron)
src/components/        site + admin UI, section components
src/content/           types + bundled launch content (seed source)
src/lib/               Supabase clients, cached content reads, admin data/actions
src/proxy.ts           session refresh + /admin gating
supabase/              migration, generated seed, content-update SQL
scripts/               seed/SQL generator
```

## Brand

Palette: forest `#292d28`, forest-deep `#1f221e`, walnut `#5e3c2b`, caramel
`#c4895a`, olive `#90894b`, sand `#d0b495`, stone `#e6d9c6`.
Type: Marcellus (headings), Jost (body), self-hosted in `src/fonts`.
