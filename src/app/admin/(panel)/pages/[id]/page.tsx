import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSection } from "@/lib/admin/data";
import { SectionEditor } from "../section-editor";

export const metadata = { title: "Edit section" };

export default async function EditSectionPage({ params }: PageProps<"/admin/pages/[id]">) {
  const { id } = await params;
  const section = await getAdminSection(id);
  if (!section) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/pages" className="link-underline text-sm text-forest/60">
        ← All pages
      </Link>
      <h1 className="mt-4 text-3xl">{section.label}</h1>
      <p className="mt-1 text-forest/55">Section &ldquo;{section.key}&rdquo; on the {section.page} page.</p>
      <div className="mt-8">
        <SectionEditor section={section} />
      </div>
    </div>
  );
}
