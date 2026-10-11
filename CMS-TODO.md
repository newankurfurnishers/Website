# CMS wiring backlog

Content added/changed as hardcoded during the design pass. At the end, wire each
item into the admin CMS so staff can edit it (migration/`types.ts`/`content.ts`/
`seed.ts` + the relevant admin editor + populate the live Supabase rows).

Status legend: ⬜ not wired · ✅ wired into CMS

## Pending

- ⬜ **About — Heritage section** (`src/app/(site)/about/page.tsx`)
  - Hardcoded: "Heritage Chronicle" eyebrow + heading, founder quote + name/role,
    "The Pillars of Our Atelier" intro, the 1984/2002/2024+ timeline (year +
    title + text), and the "Bespoke Architectural Concierge" CTA.
  - Also: founder/workshop image is a grayscale placeholder
    (`/images/brochure/wooden-furniture.webp`) — needs a real photo.
  - CMS plan: a `page_sections` row for the heading/quote/intro/CTA, and a new
    structure for the timeline (year/title/text) — likely a dedicated section
    with `items`, or a small `about_timeline` table.
  - Copy still to be finalized (accuracy of 2002 / regions / 2024+ claims).

- ⬜ **Philosophy page — Five Elements of Nature** (`src/app/(site)/philosophy/page.tsx`)
  - Hardcoded from the brand pitch deck: the intro (eyebrow/heading/lead), the
    three framework cards (timeless framework / complete philosophy / not a
    gimmick), and per-element content (sanskrit, name, subtitle, optional lead,
    principle, in-design, optional story label+text, visual language).
  - New images: `public/images/elements/{earth,water,fire,air,space}.webp`
    (extracted from the deck — AI-rendered concept imagery, not photos of real
    projects).
  - "In this element" product links still come from live categories (editable).
  - CMS plan: extend the `elements` table (add subtitle, principle, in_design,
    story_label, story_text, visual_language, lead, a second image) or a related
    structure; add a framework-cards store; swap in these fields in the admin
    Philosophy editor. Note the home-page five pills still read the existing
    `elements` rows (name/sanskrit/tagline/image), so keep those intact.

<!-- Append new items below as changes are made. -->
