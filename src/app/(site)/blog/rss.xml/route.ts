import { getPosts, getSettings } from "@/lib/content";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.newankurfurnishers.in";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      ${p.excerpt ? `<description>${esc(p.excerpt)}</description>` : ""}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(settings.business_name)} — Journal</title>
    <link>${SITE}/blog</link>
    <description>${esc(settings.seo_description ?? "Notes on furnishing homes and businesses in Patna.")}</description>
    <language>en-IN</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}
