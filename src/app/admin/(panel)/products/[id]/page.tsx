import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCategory, getElementOptions, getSectorOptions } from "@/lib/admin/data";
import { CategoryEditor } from "../category-editor";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const [category, elementOptions, sectorOptions] = await Promise.all([
    getAdminCategory(id),
    getElementOptions(),
    getSectorOptions(),
  ]);
  if (!category) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/products" className="link-underline text-sm text-forest/60">
        ← All products
      </Link>
      <h1 className="mt-4 text-3xl">{category.name}</h1>
      <div className="mt-8">
        <CategoryEditor category={category} elementOptions={elementOptions} sectorOptions={sectorOptions} />
      </div>
    </div>
  );
}
