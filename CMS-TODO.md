# CMS wiring backlog

Status legend: ⬜ not wired · ✅ wired into CMS

All redesign content is now wired into the CMS. The site reads from Supabase
with the bundled content as a fallback, so it renders correctly whether or not
the database has been upgraded yet.

## To activate editing on the live site

Run **`supabase/content-update.sql`** once in Supabase → SQL Editor. It:
- adds the long-form Philosophy columns to the `elements` table,
- refreshes all copy, and
- inserts the new page sections (Philosophy intro/framework, About heritage,
  and the Expertise/Products/Blog/Contact intros).

Until it runs, the site shows the same content from the bundled fallback; after
it runs, staff can edit everything in the admin.

## Done

- ✅ **Philosophy page** — intro + framework → *Pages → Philosophy*; each
  element's subtitle / lead / principle / in-design / story / visual language +
  image → *Philosophy* editor (new `elements` columns).
- ✅ **About heritage** — "Our story" heading + quote, "What we stand for" +
  timeline, and the consultation CTA → *Pages → About* (heritage / pillars /
  concierge sections). Founder photo is still a placeholder — upload a real one
  via *Media*.
- ✅ **Page intros** — Expertise, Products, Blog, Contact → *Pages*.
- ✅ **Home philosophy accordion** — now uses the element images from the CMS.

## Intentionally left in code

- Legal pages (Privacy, Terms, Thank-you) — static boilerplate.

## Housekeeping (storage + keeping Supabase awake)

- **Free unused storage** — *Media → "Remove unused files"* deletes any uploaded
  image not used anywhere on the site (e.g. an old hero/gallery image left behind
  after a replace). Files uploaded in the last hour are kept. Replaced files keep
  working until you run this (or the daily cron below sweeps them after 7 days).
- **Keep Supabase from pausing** — a Vercel Cron (`vercel.json`) calls
  `/api/keep-alive` once a day, which pings the database so the free-tier project
  isn't paused for inactivity. No setup needed; it runs after the next deploy.
  - *Optional:* set **`CRON_SECRET`** (Vercel → Settings → Environment Variables)
    to a long random string so only Vercel's cron can call the route. If you also
    keep **`SUPABASE_SERVICE_ROLE_KEY`** set, the daily cron additionally sweeps
    unused uploads (7-day grace) so storage is reclaimed automatically.
