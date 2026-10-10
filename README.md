# New Ankur Furnishers: website + CMS

Next.js 16 (App Router, Cache Components) · Tailwind CSS 4 · Supabase (Postgres, Auth, Storage) · Vercel.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional; without Supabase keys the site uses bundled launch content
npm run dev
```

## Supabase setup (one time)

Project: `vbmefxnglkeiceikqbib`

1. In the Supabase dashboard, open **SQL Editor** and run, in order:
   - `supabase/migrations/20261010000000_init.sql` (tables, row-level security, `media` storage bucket)
   - `supabase/seed.sql` (launch content from the brochure; safe to re-run)
2. **Settings → API**: copy the Project URL and the anon public key into `.env.local` and into Vercel's environment variables.
3. Admin users: create the user under **Authentication → Users**, then
   `insert into public.admins (user_id) values ('<user uuid>');`

To regenerate `supabase/seed.sql` after editing `src/content/seed.ts`: `npm run seed:generate`.

## Vercel

Import the GitHub repo into the `new-ankur-furnishers` team and set:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vbmefxnglkeiceikqbib.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `NEXT_PUBLIC_SITE_URL` | `https://www.newankurfurnishers.in` |

## How content flows

- `src/lib/content.ts` reads published content with the anon key. Results are cached and tagged `content`.
- Admin saves call `revalidateTag("content", "max")`, so edits appear on the site within seconds.
- Launch photos live in `public/images/brochure/`. Images uploaded through the admin go to the `media` storage bucket and replace these.

## Structure

```
src/app/            routes (public site; /admin coming next)
src/components/     header, footer, category icons
src/content/        types + brochure launch content (seed source)
src/lib/            Supabase clients, cached content reads
supabase/           migration + generated seed
```

## Brand

Palette: forest `#292d28`, walnut `#5e3c2b`, caramel `#c4895a` (provisional), olive `#90894b`, sand `#d0b495`.
Type: Marcellus (headings), Jost (body), self-hosted in `src/fonts`.
