-- New Ankur Furnishers — initial schema
-- Public site reads published content; signed-in admins manage everything.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Admins & helpers
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Global settings (single row, id = 1)
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  business_name text not null default 'New Ankur Furnishers',
  tagline text not null default 'Your Home, Your Story!',
  established_year int not null default 1984,
  phones text[] not null default '{}',
  whatsapp text,
  email text,
  address text,
  map_embed_url text,
  instagram_url text,
  facebook_url text,
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Media library (files live in the "media" storage bucket)
-- ---------------------------------------------------------------------------
create table public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,          -- storage path inside the bucket
  url text not null,                  -- public URL
  alt text not null default '',
  width int,
  height int,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Page sections: named, editable blocks on fixed pages
-- e.g. page='home', key='hero'
-- ---------------------------------------------------------------------------
create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  key text not null,
  label text not null,                -- human name shown in admin ("Home hero")
  eyebrow text,
  heading text,
  body text,
  image_url text,
  image_alt text,
  cta_label text,
  cta_href text,
  items jsonb not null default '[]'::jsonb,  -- optional list, e.g. [{ "title": "...", "text": "..." }]
  sort int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (page, key)
);

-- ---------------------------------------------------------------------------
-- Philosophy: the five elements
-- ---------------------------------------------------------------------------
create table public.elements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,          -- earth, water, fire, air, space
  name text not null,
  sanskrit text not null,
  tagline text,
  description text,
  image_url text,
  image_alt text,
  sort int not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Expertise & domains (sectors served)
-- ---------------------------------------------------------------------------
create table public.sectors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  summary text,
  body text,
  highlights jsonb not null default '[]'::jsonb,  -- [{ "title": "...", "text": "..." }]
  image_url text,
  image_alt text,
  sort int not null default 0,
  published boolean not null default true,
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Product categories (category-level pages; no individual SKUs)
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  icon text,                          -- key into the site's line-icon set
  intro text,
  body text,
  subtypes text[] not null default '{}',
  hero_image_url text,
  hero_image_alt text,
  element_id uuid references public.elements (id) on delete set null,
  sort int not null default 0,
  published boolean not null default true,
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now()
);

create table public.category_images (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort int not null default 0
);
create index on public.category_images (category_id, sort);

create table public.category_sectors (
  category_id uuid not null references public.categories (id) on delete cascade,
  sector_id uuid not null references public.sectors (id) on delete cascade,
  primary key (category_id, sector_id)
);

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------
create type public.post_status as enum ('draft', 'published');

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content_html text not null default '',
  content_json jsonb,                 -- editor document, source of truth for re-editing
  cover_image_url text,
  cover_image_alt text,
  author text not null default 'New Ankur Furnishers',
  status public.post_status not null default 'draft',
  published_at timestamptz,           -- future date = scheduled
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.posts (status, published_at desc);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.post_categories (
  post_id uuid not null references public.posts (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (post_id, category_id)
);

-- ---------------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------------
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  context text,                       -- "Hotel owner, Patna"
  quote text not null,
  sort int not null default 0,
  published boolean not null default true
);

-- ---------------------------------------------------------------------------
-- Enquiries (contact form)
-- ---------------------------------------------------------------------------
create type public.enquiry_status as enum ('new', 'contacted', 'closed');

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (char_length(phone) between 6 and 20),
  email text check (email is null or char_length(email) <= 200),
  message text check (message is null or char_length(message) <= 4000),
  interest text,                      -- category or sector the visitor picked
  source_page text,
  status public.enquiry_status not null default 'new',
  notes text,
  created_at timestamptz not null default now()
);
create index on public.enquiries (status, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['site_settings','page_sections','elements','sectors','categories','posts']
  loop
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
         for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.admins            enable row level security;
alter table public.site_settings     enable row level security;
alter table public.media             enable row level security;
alter table public.page_sections     enable row level security;
alter table public.elements          enable row level security;
alter table public.sectors           enable row level security;
alter table public.categories        enable row level security;
alter table public.category_images   enable row level security;
alter table public.category_sectors  enable row level security;
alter table public.posts             enable row level security;
alter table public.tags              enable row level security;
alter table public.post_tags         enable row level security;
alter table public.post_categories   enable row level security;
alter table public.testimonials      enable row level security;
alter table public.enquiries         enable row level security;

-- Admins: full access everywhere
do $$
declare t text;
begin
  foreach t in array array['site_settings','media','page_sections','elements','sectors','categories',
                           'category_images','category_sectors','posts','tags','post_tags',
                           'post_categories','testimonials','enquiries']
  loop
    execute format(
      'create policy "admin all %1$s" on public.%1$s for all to authenticated
         using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- Public read
create policy "public read settings"   on public.site_settings    for select using (true);
create policy "public read media"      on public.media            for select using (true);
create policy "public read elements"   on public.elements         for select using (true);
create policy "public read tags"       on public.tags             for select using (true);
create policy "public read sections"   on public.page_sections    for select using (published);
create policy "public read sectors"    on public.sectors          for select using (published);
create policy "public read categories" on public.categories       for select using (published);
create policy "public read testimonials" on public.testimonials   for select using (published);

create policy "public read category images" on public.category_images for select
  using (exists (select 1 from public.categories c where c.id = category_id and c.published));
create policy "public read category sectors" on public.category_sectors for select using (true);

create policy "public read posts" on public.posts for select
  using (status = 'published' and published_at is not null and published_at <= now());
create policy "public read post tags" on public.post_tags for select using (true);
create policy "public read post categories" on public.post_categories for select using (true);

-- Anyone may submit an enquiry; nobody but admins may read them
create policy "public submit enquiry" on public.enquiries for insert to anon, authenticated
  with check (status = 'new' and notes is null);

-- ---------------------------------------------------------------------------
-- Storage: public "media" bucket, admin-only writes
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760,
        array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml'])
on conflict (id) do nothing;

create policy "public read media bucket" on storage.objects for select
  using (bucket_id = 'media');
create policy "admin write media bucket" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
create policy "admin update media bucket" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());
create policy "admin delete media bucket" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
