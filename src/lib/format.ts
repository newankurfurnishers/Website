const digits = (s: string) => s.replace(/[^\d+]/g, "");

export const telHref = (phone: string) => `tel:${digits(phone)}`;

export const whatsappHref = (phone: string, text?: string) =>
  `https://wa.me/${digits(phone).replace(/^\+/, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
