import { settings as seedSettings } from "@/content/seed";
import type { SiteSettings } from "@/content/types";
import { getSettingsRow } from "@/lib/admin/data";
import { SettingsForm } from "./settings-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const row = await getSettingsRow();
  const settings = (row as SiteSettings | null) ?? seedSettings;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl">Settings</h1>
      <p className="mt-1 text-forest/65">
        Business details, contact information and default SEO. Changes go live on the site immediately.
      </p>
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
