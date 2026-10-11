import type { Metadata } from "next";

/**
 * Build page metadata with a canonical URL and Open Graph image.
 * `path` is the route path, e.g. "/products" or "/products/mattresses".
 * The root layout sets metadataBase, so relative URLs resolve correctly.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
}: {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  imageAlt?: string | null;
  type?: "website" | "article";
}): Metadata {
  const canonical = path === "/" ? "/" : path.replace(/\/$/, "");
  return {
    title,
    description: description ?? undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description: description ?? undefined,
      url: canonical,
      type,
      images: image ? [{ url: image, alt: imageAlt ?? title }] : undefined,
    },
  };
}
