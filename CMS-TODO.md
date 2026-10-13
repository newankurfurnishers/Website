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
