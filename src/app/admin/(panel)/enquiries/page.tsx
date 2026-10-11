import Link from "next/link";
import { type EnquiryStatus, getEnquiries } from "@/lib/admin/data";
import { formatDate } from "@/lib/format";

const FILTERS: { label: string; value?: EnquiryStatus }[] = [
  { label: "All" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Closed", value: "closed" },
];

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  const sp = await searchParams;
  const raw = typeof sp.status === "string" ? sp.status : undefined;
  const status = (["new", "contacted", "closed"] as const).find((s) => s === raw);
  const enquiries = await getEnquiries(status);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl">Enquiries</h1>
        {/* Route handler download, not a page — a plain anchor is correct here. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/admin/enquiries/export" className="link-underline text-sm">
          Export CSV
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const on = f.value === status;
          const href = f.value ? `/admin/enquiries?status=${f.value}` : "/admin/enquiries";
          return (
            <Link
              key={f.label}
              href={href}
              aria-current={on ? "true" : undefined}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                on ? "bg-forest text-sand" : "bg-white text-forest hover:bg-stone/60"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {enquiries.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white px-5 py-10 text-center text-forest/60">
          No enquiries{status ? ` marked "${status}"` : " yet"}.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-forest/10 overflow-hidden rounded-xl bg-white">
          {enquiries.map((e) => (
            <li key={e.id}>
              <Link href={`/admin/enquiries/${e.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-stone/50">
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{e.name}</span>
                  <span className="block truncate text-sm text-forest/60">
                    {e.phone}
                    {e.interest ? ` · ${e.interest}` : ""}
                  </span>
                </span>
                <StatusPill status={e.status} />
                <span className="hidden text-sm text-forest/50 sm:block">{formatDate(e.created_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: EnquiryStatus }) {
  const map: Record<EnquiryStatus, string> = {
    new: "bg-caramel/20 text-walnut",
    contacted: "bg-olive/20 text-forest",
    closed: "bg-forest/10 text-forest/60",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${map[status]}`}>{status}</span>;
}
