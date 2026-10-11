import Link from "next/link";
import { getElementOptions, getSectorOptions } from "@/lib/admin/data";
import { CategoryEditor } from "../category-editor";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  const [elementOptions, sectorOptions] = await Promise.all([getElementOptions(), getSectorOptions()]);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/products" className="link-underline text-sm text-forest/60">
        ← All products
      </Link>
      <h1 className="mt-4 text-3xl">New product</h1>
      <div className="mt-8">
        <CategoryEditor category={null} elementOptions={elementOptions} sectorOptions={sectorOptions} />
      </div>
    </div>
  );
}
