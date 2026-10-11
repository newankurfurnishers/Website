export function ComingSoon({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div>
      <h1 className="text-3xl">{title}</h1>
      <div className="mt-8 rounded-xl bg-white px-6 py-12 text-center">
        <p className="font-display text-2xl">Coming soon</p>
        <p className="mx-auto mt-2 max-w-md text-forest/65">{blurb}</p>
      </div>
    </div>
  );
}
