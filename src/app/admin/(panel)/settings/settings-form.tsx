"use client";

import { useActionState } from "react";
import { Field, SaveMessage, SubmitButton, TextArea } from "@/components/admin/ui";
import type { SiteSettings } from "@/content/types";
import { type SettingsState, updateSettings } from "./actions";

const initial: SettingsState = { status: "idle" };

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(updateSettings, initial);

  return (
    <form action={action} className="grid gap-6">
      <section className="grid gap-4 rounded-xl bg-white p-6">
        <h2 className="text-lg">Business</h2>
        <Field label="Business name" name="business_name" defaultValue={settings.business_name} required />
        <Field label="Tagline" name="tagline" defaultValue={settings.tagline} required />
        <Field
          label="Established year"
          name="established_year"
          type="number"
          defaultValue={settings.established_year}
        />
        <Field label="Address" name="address" defaultValue={settings.address} />
      </section>

      <section className="grid gap-4 rounded-xl bg-white p-6">
        <h2 className="text-lg">Contact</h2>
        <TextArea
          label="Phone numbers"
          name="phones"
          defaultValue={settings.phones.join("\n")}
          hint="One number per line. The first is used as the main number."
          rows={3}
        />
        <Field label="WhatsApp number" name="whatsapp" defaultValue={settings.whatsapp} hint="Digits only, with country code, e.g. 919334331429" />
        <Field label="Email" name="email" type="email" defaultValue={settings.email} />
        <Field label="Instagram URL" name="instagram_url" defaultValue={settings.instagram_url} />
        <Field label="Facebook URL" name="facebook_url" defaultValue={settings.facebook_url} />
        <TextArea
          label="Google Maps embed URL"
          name="map_embed_url"
          defaultValue={settings.map_embed_url}
          hint="The src URL from Google Maps → Share → Embed a map."
          rows={2}
        />
      </section>

      <section className="grid gap-4 rounded-xl bg-white p-6">
        <h2 className="text-lg">Default SEO</h2>
        <Field label="Default page title" name="seo_title" defaultValue={settings.seo_title} />
        <TextArea label="Default description" name="seo_description" defaultValue={settings.seo_description} rows={3} />
      </section>

      <SaveMessage state={state} />
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
