import Link from "next/link";
import { type AdminPostSummary, getAdminPosts } from "@/lib/admin/data";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Blog" };

export default async function BlogAdminPage() {
  const posts = await getAdminPosts();
  // This admin route is request-time dynamic (not prerendered), so reading the
  // clock to separate scheduled from published posts is safe here.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  const drafts = posts.filter((p) => p.status === "draft");
  const scheduled = posts.filter((p) => p.status === "published" && p.published_at && new Date(p.published_at).getTime() > now);
  const published = posts.filter((p) => p.status === "published" && (!p.published_at || new Date(p.published_at).getTime() <= now));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Blog</h1>
          <p className="mt-1 text-forest/65">Write posts, save drafts, publish now or schedule for later.</p>
        </div>
        <Link href="/admin/blog/new" className="btn btn-dark">
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white px-5 py-10 text-center text-forest/60">
          No posts yet. Write your first post.
        </p>
      ) : (
        <div className="mt-8 grid gap-8">
          <Group title="Drafts" posts={drafts} empty="No drafts." />
          <Group title="Scheduled" posts={scheduled} empty="Nothing scheduled." dateLabel="Goes live" />
          <Group title="Published" posts={published} empty="Nothing published yet." dateLabel="Published" />
        </div>
      )}
    </div>
  );
}

function Group({
  title,
  posts,
  empty,
  dateLabel,
}: {
  title: string;
  posts: AdminPostSummary[];
  empty: string;
  dateLabel?: string;
}) {
  return (
    <section>
      <h2 className="text-xl">
        {title} <span className="text-base text-forest/45">({posts.length})</span>
      </h2>
      {posts.length === 0 ? (
        <p className="mt-2 text-sm text-forest/50">{empty}</p>
      ) : (
        <ul className="mt-3 divide-y divide-forest/10 overflow-hidden rounded-xl bg-white">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/blog/${p.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-stone/50">
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{p.title}</span>
                  <span className="block truncate text-sm text-forest/55">/blog/{p.slug}</span>
                </span>
                {dateLabel && p.published_at && (
                  <span className="hidden text-sm text-forest/50 sm:block">
                    {dateLabel} {formatDate(p.published_at)}
                  </span>
                )}
                <span className="text-sm text-forest/40">Edit →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
