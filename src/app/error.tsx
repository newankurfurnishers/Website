"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-site flex min-h-[60svh] flex-col justify-center py-20">
      <p className="text-walnut">Something went wrong</p>
      <h1 className="mt-3 text-[clamp(2.4rem,5vw,4rem)]">That didn&rsquo;t load as it should.</h1>
      <p className="mt-5 max-w-[48ch] text-lg text-forest/75">
        Please try again. If it keeps happening, call us and we&rsquo;ll help right away.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={() => retry()} className="btn btn-dark">
          Try again
        </button>
        <Link href="/" className="btn btn-line text-forest">
          Go home
        </Link>
        <Link href="/contact" className="btn btn-line text-forest">
          Contact us
        </Link>
      </div>
    </section>
  );
}
