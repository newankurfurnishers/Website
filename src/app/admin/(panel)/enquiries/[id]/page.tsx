import Link from "next/link";
import { notFound } from "next/navigation";
import { getEnquiry } from "@/lib/admin/data";
import { formatDate, telHref, whatsappHref } from "@/lib/format";
import { EnquiryForm } from "./enquiry-form";

export default async function EnquiryDetailPage({ params }: PageProps<"/admin/enquiries/[id]">) {
  const { id } = await params;
  const e = await getEnquiry(id);
  if (!e) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/enquiries" className="link-underline text-sm text-forest/60">
        ← All enquiries
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl">{e.name}</h1>
          <p className="mt-1 text-forest/60">Received {formatDate(e.created_at)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={telHref(e.phone)} className="btn btn-dark">
          Call {e.phone}
        </a>
        <a
          href={whatsappHref(e.phone, `Hello ${e.name}, thank you for your enquiry to New Ankur Furnishers.`)}
          target="_blank"
          rel="noopener"
          className="btn btn-line text-forest"
        >
          WhatsApp
        </a>
        {e.email && (
          <a href={`mailto:${e.email}`} className="btn btn-line text-forest">
            Email
          </a>
        )}
      </div>

      <dl className="mt-8 grid gap-x-8 gap-y-4 rounded-xl bg-white p-6 sm:grid-cols-2">
        <Detail label="Phone" value={e.phone} />
        <Detail label="Email" value={e.email ?? "—"} />
        <Detail label="Interested in" value={e.interest ?? "—"} />
        <Detail label="From page" value={e.source_page ?? "—"} />
        <div className="sm:col-span-2">
          <dt className="text-sm text-forest/55">Message</dt>
          <dd className="mt-1 whitespace-pre-wrap text-forest/90">{e.message || "—"}</dd>
        </div>
      </dl>

      <div className="mt-8 rounded-xl bg-white p-6">
        <h2 className="text-xl">Manage</h2>
        <div className="mt-4">
          <EnquiryForm id={e.id} status={e.status} notes={e.notes} />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-forest/55">{label}</dt>
      <dd className="mt-0.5 text-forest/90">{value}</dd>
    </div>
  );
}
