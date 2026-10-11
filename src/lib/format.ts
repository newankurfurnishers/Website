const digits = (s: string) => s.replace(/[^\d+]/g, "");

export const telHref = (phone: string) => `tel:${digits(phone)}`;

export const whatsappHref = (phone: string, text?: string) =>
  `https://wa.me/${digits(phone).replace(/^\+/, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** Format an ISO date as "11 October 2026" (en-IN, UTC to stay deterministic). */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );

/** Rough reading time in minutes from HTML, min 1. */
export const readingTime = (html: string) => {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
