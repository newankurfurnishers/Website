import Link from "next/link";
import { getAdminSectors } from "@/lib/admin/data";
import { SectorList } from "./sector-list";

export const metadata = { title: "Expertise" };

export default async function ExpertiseAdminPage() {
  const sectors = await getAdminSectors();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Expertise</h1>
          <p className="mt-1 text-forest/65">The sectors you serve. Reorder with the arrows; toggle to show or hide.</p>
        </div>
        <Link href="/admin/expertise/new" className="btn btn-dark">
          New sector
        </Link>
      </div>
      <SectorList sectors={sectors} />
    </div>
  );
}
