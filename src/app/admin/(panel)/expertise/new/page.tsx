import Link from "next/link";
import { SectorEditor } from "../sector-editor";

export const metadata = { title: "New sector" };

export default function NewSectorPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/expertise" className="link-underline text-sm text-forest/60">
        ← All sectors
      </Link>
      <h1 className="mt-4 text-3xl">New sector</h1>
      <div className="mt-8">
        <SectorEditor sector={null} />
      </div>
    </div>
  );
}
