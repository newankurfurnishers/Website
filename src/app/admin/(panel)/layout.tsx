import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { signOut } from "@/app/admin/actions";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · New Ankur admin" },
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-stone" aria-hidden="true" />}>
      <Panel>{children}</Panel>
    </Suspense>
  );
}

async function Panel({ children }: { children: React.ReactNode }) {
  const { userId, email, isAdmin } = await getAdmin();
  if (!userId) redirect("/admin/login");
  if (!isAdmin) return <NoAccess email={email} />;

  return (
    <div className="min-h-dvh bg-stone lg:flex">
      <AdminSidebar email={email} />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-5 py-8 lg:px-10 lg:py-12">{children}</div>
      </div>
    </div>
  );
}

function NoAccess({ email }: { email: string | null }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-stone px-5">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_12px_40px_rgba(41,45,40,0.08)]">
        <h1 className="text-2xl">This account doesn&rsquo;t have admin access</h1>
        <p className="mt-3 text-forest/70">
          You&rsquo;re signed in{email ? ` as ${email}` : ""}, but this account isn&rsquo;t set up to manage
          the website. Ask your website administrator to grant access.
        </p>
        <form action={signOut} className="mt-6">
          <button type="submit" className="btn btn-dark justify-center">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
