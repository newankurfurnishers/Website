import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSector } from "@/lib/admin/data";
import { SectorEditor } from "../sector-editor";

export const metadata = { title: "Edit sector" };

export default async function EditSectorPage({ params }: PageProps<"/admin/expertise/[id]">) {
  const { id } = await params;
  const sector = await getAdminSector(id);
  if (!sector) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/expertise" className="link-underline text-sm text-forest/60">
        ← All sectors
      </Link>
      <h1 className="mt-4 text-3xl">{sector.name}</h1>
      <div className="mt-8">
        <SectorEditor sector={sector} />
      </div>
    </div>
  );
}
