export type Item = { title: string; text?: string };

export type SiteSettings = {
  business_name: string;
  tagline: string;
  established_year: number;
  phones: string[];
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  map_embed_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

export type PageSection = {
  page: string;
  key: string;
  label: string;
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  items?: Item[];
  sort: number;
};

export type ElementSlug = "earth" | "water" | "fire" | "air" | "space";

export type NatureElement = {
  slug: ElementSlug;
  name: string;
  sanskrit: string;
  tagline: string;
  description: string;
  image_url: string;
  image_alt: string;
  sort: number;
};

export type Sector = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  body?: string | null;
  highlights: Item[];
  image_url: string;
  image_alt: string;
  sort: number;
  seo_title?: string | null;
  seo_description?: string | null;
};

export type CategoryImage = { url: string; alt: string };

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  intro: string;
  body?: string | null;
  subtypes: string[];
  hero_image_url: string;
  hero_image_alt: string;
  element: ElementSlug | null;
  sectors: string[]; // sector slugs
  images: CategoryImage[];
  sort: number;
  seo_title?: string | null;
  seo_description?: string | null;
};
