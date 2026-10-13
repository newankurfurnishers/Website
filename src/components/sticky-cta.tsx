import Link from "next/link";
import { getSettings } from "@/lib/content";
import { telHref } from "@/lib/format";

// Persistent call-to-action bar on mobile. Hidden on desktop (the header CTA
// shows there). The spacer keeps the bar from covering the footer.
export async function StickyCta() {
  "use cache";
  const settings = await getSettings();
  return (
    <>
      <div className="h-[4.75rem] lg:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand/15 bg-forest px-4 py-3 lg:hidden">
        <div className="flex gap-3">
          {settings.phones[0] && (
            <a
              href={telHref(settings.phones[0])}
              className="btn btn-line min-h-12 flex-1 justify-center whitespace-nowrap px-3 text-[0.95rem] text-sand"
            >
              Call us
            </a>
          )}
          <Link
            href="/contact"
            className="btn btn-solid min-h-12 flex-1 justify-center whitespace-nowrap px-3 text-[0.95rem]"
          >
            Make an enquiry
          </Link>
        </div>
      </div>
    </>
  );
}
