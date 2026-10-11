import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[60svh] flex-col justify-center py-20">
      <p className="text-walnut">404</p>
      <h1 className="mt-3 text-[clamp(2.4rem,5vw,4rem)]">We couldn&rsquo;t find that page.</h1>
      <p className="mt-5 max-w-[48ch] text-lg text-forest/75">
        The page may have moved, or the link may be out of date. Here&rsquo;s the way back.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-dark">
          Go home
        </Link>
        <Link href="/products" className="btn btn-line text-forest">
          Browse products
        </Link>
        <Link href="/contact" className="btn btn-line text-forest">
          Make an enquiry
        </Link>
      </div>
    </section>
  );
}
