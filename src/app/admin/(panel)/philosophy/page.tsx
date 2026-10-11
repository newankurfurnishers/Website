import { getAdminElements } from "@/lib/admin/data";
import { ElementList } from "./element-list";

export const metadata = { title: "Philosophy" };

export default async function PhilosophyAdminPage() {
  const elements = await getAdminElements();

  return (
    <div>
      <h1 className="text-3xl">Philosophy</h1>
      <p className="mt-1 text-forest/65">
        The five elements shown on the Philosophy page. Edit each one; reorder with the arrows.
      </p>
      <ElementList elements={elements} />
    </div>
  );
}
