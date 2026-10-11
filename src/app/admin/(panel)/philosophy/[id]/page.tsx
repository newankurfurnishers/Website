import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminElement } from "@/lib/admin/data";
import { ElementEditor } from "../element-editor";

export const metadata = { title: "Edit element" };

export default async function EditElementPage({ params }: PageProps<"/admin/philosophy/[id]">) {
  const { id } = await params;
  const element = await getAdminElement(id);
  if (!element) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/philosophy" className="link-underline text-sm text-forest/60">
        ← All elements
      </Link>
      <h1 className="mt-4 text-3xl">{element.name}</h1>
      <div className="mt-8">
        <ElementEditor element={element} />
      </div>
    </div>
  );
}
