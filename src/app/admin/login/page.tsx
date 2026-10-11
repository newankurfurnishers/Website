import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-stone px-5 py-12">
      <div className="w-full max-w-sm">
        <Image
          src="/logo.png"
          alt="New Ankur Furnishers"
          width={1713}
          height={675}
          priority
          className="mx-auto h-12 w-auto"
        />
        <div className="mt-8 rounded-2xl bg-white p-7 shadow-[0_1px_0_rgba(41,45,40,0.08),0_12px_40px_rgba(41,45,40,0.08)]">
          <h1 className="text-2xl">Staff sign in</h1>
          <p className="mt-1.5 text-sm text-forest/65">Manage the website content and enquiries.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-forest/55">
          Trouble signing in? Contact your website administrator.
        </p>
      </div>
    </div>
  );
}
