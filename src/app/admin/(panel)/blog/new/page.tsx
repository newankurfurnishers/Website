import Link from "next/link";
import { getAdminTags, getCategoryOptions } from "@/lib/admin/data";
import { PostEditor } from "../post-editor";

export const metadata = { title: "New post" };

export default async function NewPostPage() {
  const [tagOptions, categoryOptions] = await Promise.all([getAdminTags(), getCategoryOptions()]);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/blog" className="link-underline text-sm text-forest/60">
        ← All posts
      </Link>
      <h1 className="mt-4 text-3xl">New post</h1>
      <div className="mt-8">
        <PostEditor post={null} tagOptions={tagOptions} categoryOptions={categoryOptions} />
      </div>
    </div>
  );
}
