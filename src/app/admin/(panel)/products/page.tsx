import Link from "next/link";
import { getAdminCategories } from "@/lib/admin/data";
import { ProductList } from "./product-list";

export const metadata = { title: "Products" };

export default async function ProductsAdminPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Products</h1>
          <p className="mt-1 text-forest/65">Drag order with the arrows. Toggle to show or hide on the site.</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-dark">
          New product
        </Link>
      </div>
      <ProductList categories={categories} />
    </div>
  );
}
