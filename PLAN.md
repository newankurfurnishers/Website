# New Ankur Furnishers: build plan & handoff

Read this file first. It holds the decisions made so far, what is built, and what to build next.
Work through the phases in order; tick the checkboxes as items land.

---

## 1. The client and the brief

- **Client:** New Ankur Furnishers, Saket Tower, S.P. Verma Road, Patna 800001. Established 1984 (40+ years). Founder: Santosh Kumar Agrawal.
- **Business:** home furnishings and interiors for homes, hotels, hospitals, offices and institutions: curtains, blinds, flooring, wallpapers, mattresses, bedding, rugs, furniture, landscaping, glass films, home automation.
- **Tagline:** "Your Home, Your Story!"
- **Goal:** a fast, SEO-friendly brochure site plus an admin CMS so shop staff can change images and text themselves.
- **Domain:** www.newankurfurnishers.in (currently an old site; we replace it at launch).

### Decisions already made (do not reopen)

| Topic | Decision |
| --- | --- |
| Logo | Sprout/house mark (`public/logo.png`, light version `public/logo-light.png`) |
| Products | Category-level pages only. No individual SKUs, no prices, no cart |
| Catalogues | No PDF catalogues |
| Language | English only (founder's Hindi note is translated on About) |
| Photography | Launch with brochure images (`public/images/brochure/`); staff replace them via the admin |
| Blog | Yes, for SEO |
| Sitemap | Home, Philosophy (5 elements), Expertise & Domains, Products, Blog, About, Contact |

### Open items (ask the client, don't guess)

- [ ] Real hex for the **caramel** swatch (colour card printed `#d0b495` twice; `#c4895a` is a provisional estimate)
- [ ] Business **email** for enquiry notifications
- [ ] Confirm **WhatsApp** number (currently first phone: +91 93343 31429)
- [ ] Logo as **SVG** or high-res PNG (current file was cut from a JPEG)
- [ ] Facebook page URL; Google Maps embed URL for the shop

---

## 2. Stack and accounts

- **Next.js 16.4** (App Router, `cacheComponents: true`, Partial Prefetching), **React 19**, **Tailwind CSS 4**, TypeScript.
- **Supabase** project `vbmefxnglkeiceikqbib`: Postgres + Auth + Storage.
- **Vercel** team `new-ankur-furnishers`.
- **GitHub** `newankurfurnishers/Website`.

### Next.js 16 rules (important: this differs from older Next.js)

- Read the docs bundled in `node_modules/next/dist/docs/` before using an API you're unsure of.
- Data caching uses the `"use cache"` directive with `cacheTag()` / `cacheLife()` (see `src/lib/content.ts`), not `fetch` caching or `unstable_cache`.
- After an admin save: `revalidateTag("content", "max")` (two arguments; one-argument form is deprecated). In Server Actions where the editor must see their own change immediately, use `updateTag("content")`.
- Middleware is now **`proxy.ts`** (`src/proxy.ts`), see `docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- `params` / `searchParams` / `cookies()` are async. Keep request-time reads inside `<Suspense>` so routes keep a static shell.
- Fonts are self-hosted with `next/font/local` (Google Fonts is not reachable from some build environments).

### Environment variables (`.env.local` and Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=https://vbmefxnglkeiceikqbib.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
NEXT_PUBLIC_SITE_URL=https://www.newankurfurnishers.in
SUPABASE_SERVICE_ROLE_KEY=<server only: never expose, never commit>
RESEND_API_KEY=<optional, for enquiry emails>
ENQUIRY_NOTIFY_EMAIL=<client's email>
```

Without the Supabase variables the site renders the bundled launch content from `src/content/seed.ts`, so it always builds.

---

## 3. What is built (Phase 1: done)

- [x] Next.js project scaffold, lint/typecheck/build clean
- [x] Supabase migration `supabase/migrations/20261010000000_init.sql`
  - Tables: `admins`, `site_settings` (single row), `media`, `page_sections`, `elements`, `sectors`, `categories`, `category_images`, `category_sectors`, `posts`, `tags`, `post_tags`, `post_categories`, `testimonials`, `enquiries`
  - RLS: public reads only published rows; posts visible when `status='published' and published_at <= now()` (future date = scheduled); anyone may insert an enquiry; only admins (`public.is_admin()`) read enquiries or write anything
  - Storage bucket `media` (public read, admin write, 10 MB, images only)
  - Verified on a local Postgres: migration + seed run cleanly twice; RLS behaves as above
- [x] Seed: `src/content/seed.ts` is the source of truth → `npm run seed:generate` writes `supabase/seed.sql` (idempotent)
  - 14 categories with taglines, icons, sub-types, element, sectors and galleries
  - 6 sectors (Home, Hotels & Restaurants, Healthcare, Institutions & Education, Office & Industrial, Art & Decor) with highlights from the brochure
  - 5 elements: Earth/Prithvi, Water/Jal, Fire/Agni, Air/Vayu, Space/Akasha
  - Page sections for Home and About (incl. English translation of the founder's note)
- [x] 59 launch photos cropped from the brochure pages (text removed) in `public/images/brochure/*.webp`
- [x] Design system in `src/app/globals.css` (see section 5)
- [x] Data layer `src/lib/content.ts` (cached, tagged `content`) and Supabase clients in `src/lib/supabase/` (`public.ts` cookie-less for cached reads, `server.ts` session client, `browser.ts`)
- [x] Header (sticky, mobile menu), footer (address, phones, WhatsApp, Instagram)
- [x] Home page: hero, story, five-elements pills, signage-style category columns, sector arches, enquiry banner. Checked at 1440px and 390px, no horizontal scroll

### One-time setup still needed

- [ ] Push this repo to `newankurfurnishers/Website` (branch `main`)
- [ ] Supabase → SQL Editor: run the migration, then `supabase/seed.sql`
- [ ] Vercel: import the repo, add env vars, deploy
- [ ] Create the first admin: Supabase → Authentication → Add user, then `insert into public.admins (user_id) values ('<uuid>');`

---

## 4. Next phases

### Phase 2: remaining public pages

Every page reads through `src/lib/content.ts` and uses the existing components and tokens. Add `generateMetadata` (title, description, canonical, Open Graph image) to each.

- [x] **`/philosophy`**: intro, then the five elements as full sections (anchor ids `#earth` … `#space`, the Home pills link there). Each element lists its categories (`categories.element`), linked.
- [x] **`/expertise`**: index of the 6 sectors (reuse the arch image cards).
- [x] **`/expertise/[slug]`**: hero image, summary, highlights grid, related categories (`category_sectors`), enquiry CTA prefilled with the sector. `generateStaticParams` from sectors.
- [x] **`/products`**: the signage index (`SignColumn` moved to `src/components/sign-column.tsx`), filterable by element (client-side, keeps a static shell).
- [x] **`/products/[slug]`**: hero, intro, sub-types list, gallery (lightbox, keyboard accessible), sectors served, related blog posts, "Enquire about this" button → `/contact?interest=<slug>`. `generateStaticParams` from categories.
- [x] **`/about`**: intro, why choose us (4 items), founder's note with signature, testimonials if any.
- [x] **`/contact`**:
  - Form fields: name, phone (required, Indian formats), email (optional), interest (select of categories + sectors, prefilled from `?interest=`), message.
  - Server Action inserts into `enquiries` with the anon client; honeypot field + simple per-IP rate limit; Zod validation with clear inline errors.
  - On success: confirmation message on the page ("Thanks, we'll call you within one working day"), plus email to `ENQUIRY_NOTIFY_EMAIL` via Resend if configured.
  - Also: click-to-call for all three numbers, WhatsApp link, address, Google Map embed (from settings), shop hours if provided.
- [x] **`/blog`** and **`/blog/[slug]`**:
  - Add `getPosts()`, `getPost(slug)`, `getTags()` to `content.ts`.
  - Index: cover image, title, excerpt, date, tag filter. Post: cover, reading time, author, rendered `content_html` (sanitised at save time), related categories, related posts, enquiry CTA.
  - `Article` JSON-LD; RSS at `/blog/rss.xml`. (No `generateStaticParams` on `/blog/[slug]`: posts can be empty at build, which Cache Components rejects — posts render on request with a static shell. Add it once there are posts if you want them prerendered.)
- [x] **SEO plumbing:** `src/app/sitemap.ts` (all pages, categories, sectors, published posts), `robots.ts`, `HomeAndConstructionBusiness` JSON-LD in the layout, default OG image (`src/app/opengraph-image.tsx`). _App icon from the sprout mark still pending a square/SVG logo file (open item)._
- [x] **`not-found.tsx`** and **`error.tsx`** in brand style, each with a way back (Home, Products, Contact).

### Phase 3: admin CMS (`/admin`)

Audience: non-technical shop staff on desktop and phone. Plain language, big targets, every action named for what it does ("Save changes", "Replace photo", "Publish post").

- [x] **Auth:** `/admin/login` (email + password via Supabase Auth). `src/proxy.ts` refreshes the session cookie on `/admin/*`. Every admin route and Server Action checks `is_admin()`; non-admins see a clear "This account doesn't have admin access" screen.
- [x] **Layout:** sidebar with Dashboard, Pages, Products, Expertise, Philosophy, Blog, Enquiries, Media, Settings. A "View site" link.
- [x] **Dashboard:** new enquiries count + latest 5, draft posts, quick links.
- [x] **Pages:** list of `page_sections` grouped by page; edit heading, body, image (pick from library or upload), button label/link, list items. Live preview link.
- [x] **Products:** list with drag-to-reorder and published toggle; edit name, tagline, icon (picker from `iconKeys` in `src/components/category-icon.tsx`), intro, sub-types (add/remove/reorder), element, sectors, hero image, gallery (upload many, reorder, alt text, remove), SEO title/description. Slug auto-generated from name, editable, unique.
- [x] **Expertise / Philosophy:** same editor pattern for sectors (incl. highlights list) and elements.
- [x] **Blog:** list (drafts, scheduled, published); editor with Tiptap (headings, bold/italic, lists, links, quotes, images from library); fields for slug, excerpt, cover, tags, related categories, SEO title/description, OG image with a Google result preview; Save draft / Publish now / Schedule (date-time). Store `content_json` (editor doc) and sanitised `content_html`.
- [x] **Enquiries:** inbox table (new/contacted/closed), filters, detail with notes, status change, click-to-call and WhatsApp buttons, CSV export.
- [x] **Media:** library grid; upload compresses in the browser to WebP (max 2000px), uploads to the `media` bucket, records width/height and requires alt text. Show where an image is used before allowing delete.
- [x] **Settings:** business name, tagline, phones, WhatsApp, email, address, map embed, social links, default SEO title/description.
- [x] **After every save:** `updateTag("content")` (Server Action) so the change is live on the next page load; show "Saved. Live on the site now."
- [x] Empty states that say what to do next ("No posts yet. Write your first post").
 launch

- [ ] Point `newankurfurnishers.in` + `www` to Vercel; redirect old URLs that rank (check Google Search Console) to the new equivalents.
- [ ] Vercel Analytics or Plausible; Google Search Console + submit sitemap; link Google Business Profile.
- [ ] Lighthouse ≥ 90 on mobile for Home, a category page and a post; check all images have alt text.
- [ ] Write 4 starter posts (local search intent), e.g. blackout vs sheer curtains for Patna summers; SPC vs wooden flooring in Bihar's humidity; hospital furnishing checklist; 40 years of New Ankur.
- [ ] Handover guide for staff: logging in, replacing a photo, editing a category, writing a post, handling enquiries.

---

## 5. Design system (keep consistent)

**Palette** (Tailwind tokens in `globals.css`):
`forest #292d28` (primary dark surface and text) · `walnut #5e3c2b` (warm dark surface) · `caramel #c4895a` (provisional; focus rings, small accents) · `olive #90894b` (accent on dark) · `sand #d0b495` (signage surface, text on dark) · `stone #e6d9c6` (page background).

**Type:** Marcellus for headings (sentence case, regular weight), Jost for body. Files in `src/fonts/`.

**Signature elements** (use these; don't add new decorative devices):
1. **Signage column**: sand panel with a wavy right edge (`.wave-right`), line icon | thin rule | name + tagline. Mirrors the showroom signage.
2. **Five pills**: tall fully-rounded image capsules, overlapping, ringed in forest, element name set vertically. Mirrors the client's colour card.
3. **Arch images**: `rounded-t-[11rem]` on sector cards.
4. The only automatic motion is the hero photo settling on load (`.hero-settle`). Respect reduced motion.

**Avoid:** all-caps tracked labels, eyebrows above every heading, stat-number strips, identical rounded cards with drop shadows, arrows appended to links, gradients as decoration.

**Copy:** plain, warm, specific to the shop; sentence case; buttons say what happens ("Make an enquiry", "Call +91 …").

**Quality floor:** works at 360px with no horizontal scroll; visible keyboard focus; semantic headings; alt text on every image; `next/image` with correct `sizes`.

---

## 6. Repo map

```
src/app/                 routes (layout, home); add pages + /admin here
src/components/          site-header, mobile-nav, site-footer, category-icon
src/content/types.ts     shared content types
src/content/seed.ts      launch content (source for seed.sql + offline fallback)
src/lib/content.ts       cached public reads (tag "content")
src/lib/supabase/        env, public (cached reads), server (session), browser clients
src/lib/format.ts        tel: and WhatsApp link helpers
src/fonts/               self-hosted Marcellus + Jost
public/images/brochure/  launch photos
supabase/migrations/     schema + RLS + storage
supabase/seed.sql        generated: npm run seed:generate
```

## 7. Definition of done for each change

`npm run lint`, `npx tsc --noEmit` and `npm run build` pass; the page is checked at 1440px and 390px; new content fields exist in the migration, `types.ts`, `content.ts` and the admin editor together.
