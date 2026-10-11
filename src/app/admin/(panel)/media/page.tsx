import { getMedia } from "@/lib/admin/data";
import { MediaLibrary } from "./media-library";

export const metadata = { title: "Media" };

export default async function MediaAdminPage() {
  const media = await getMedia();

  return (
    <div>
      <h1 className="text-3xl">Media</h1>
      <p className="mt-1 text-forest/65">
        Photos used across the site. Upload here, or directly when editing a product, sector or page.
      </p>
      <div className="mt-8">
        <MediaLibrary media={media} />
      </div>
    </div>
  );
}
