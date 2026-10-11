import Link from "next/link";
import { getDashboard } from "@/lib/admin/data";
import { formatDate } from "@/lib/format";

export default async function AdminDashboard() {
  const { newEnquiries, latest, draftPosts } = await getDashboard();

  return (
    <div>
      <h1 className="text-3xl">Dashboard</h1>
      <p className="mt-1 text-forest/65">Welcome back. Here&rsquo;s what needs your attention.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/enquiries?status=new" className="admin-card">
          <span className="text-4xl font-display">{newEnquiries}</span>
          <span className="mt-1 block text-forest/65">New enquiries</span>
        </Link>
        <Link href="/admin/blog" className="admin-card">
          <span className="text-4xl font-display">{draftPosts}</span>
          <span className="mt-1 block text-forest/65">Draft posts</span>
        </Link>
        <Link href="/admin/products" className="admin-card">
          <span className="font-display text-2xl">Manage products</span>
          <span className="mt-1 block text-forest/65">Edit categories &amp; photos</span>
        </Link>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Latest enquiries</h2>
          <Link href="/admin/enquiries" className="link-underline text-sm">
            View all
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className="mt-4 rounded-xl bg-white px-5 py-8 text-center text-forest/60">
            No enquiries yet. They&rsquo;ll appear here as people submit the contact form.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-forest/10 overflow-hidden rounded-xl bg-white">
            {latest.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/enquiries/${e.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-stone/50">
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{e.name}</span>
                    <span className="block truncate text-sm text-forest/60">
                      {e.phone}
                      {e.interest ? ` · ${e.interest}` : ""}
                    </span>
                  </span>
                  {e.status === "new" && (
                    <span className="rounded-full bg-caramel/20 px-2.5 py-0.5 text-xs text-walnut">New</span>
                  )}
                  <span className="hidden text-sm text-forest/50 sm:block">{formatDate(e.created_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
