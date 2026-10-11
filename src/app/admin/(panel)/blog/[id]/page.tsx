import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminPost, getAdminTags, getCategoryOptions } from "@/lib/admin/data";
import { PostEditor } from "../post-editor";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  const { id } = await params;
  const [post, tagOptions, categoryOptions] = await Promise.all([
    getAdminPost(id),
    getAdminTags(),
    getCategoryOptions(),
  ]);
  if (!post) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/blog" className="link-underline text-sm text-forest/60">
        ← All posts
      </Link>
      <h1 className="mt-4 text-3xl">{post.title}</h1>
      <div className="mt-8">
        <PostEditor post={post} tagOptions={tagOptions} categoryOptions={categoryOptions} />
      </div>
    </div>
  );
}
