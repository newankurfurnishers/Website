// Thin line icons in the spirit of the showroom signage.
// Keys are stored in categories.icon, so the admin can pick one from this set.
const paths: Record<string, React.ReactNode> = {
  mattress: (
    <>
      <path d="M6 14c4-3 8 3 12 0s8 3 12 0 6 1 8 0" />
      <path d="M6 21c4-3 8 3 12 0s8 3 12 0 6 1 8 0" />
      <path d="M6 28c4-3 8 3 12 0s8 3 12 0 6 1 8 0" />
    </>
  ),
  pillow: (
    <>
      <path d="M9 11c7 2 15 2 22 0-2 6-2 12 0 18-7-2-15-2-22 0 2-6 2-12 0-18Z" />
      <path d="M14 20h12" />
    </>
  ),
  towel: (
    <>
      <path d="M10 9h20v22H10z" />
      <path d="M10 25h20M10 28h20" />
    </>
  ),
  curtain: (
    <>
      <path d="M6 8h28" />
      <path d="M9 8c0 9 2 17 7 24M14 8c0 8 1 15 5 21" />
      <path d="M31 8c0 9-2 17-7 24M26 8c0 8-1 15-5 21" />
    </>
  ),
  blinds: (
    <>
      <path d="M8 9h24M8 13h24M8 17h24M8 21h24M8 25h24M8 29h24" />
      <path d="M20 29v4" />
    </>
  ),
  flooring: (
    <>
      <path d="M6 32 16 8M14 32 24 8M22 32 32 8" />
      <path d="M4 32h32" />
    </>
  ),
  wallpaper: (
    <>
      <path d="M11 8v24M17 8v24M23 8v24M29 8v24" />
      <path d="M11 14c2 2 4 2 6 0M23 22c2 2 4 2 6 0" />
    </>
  ),
  chair: (
    <>
      <path d="M12 20V12a8 8 0 0 1 16 0v8" />
      <path d="M9 20h22v6H9zM12 26v6M28 26v6" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 33V17" />
      <path d="M20 17c-7 0-10-5-10-10 6 0 10 4 10 10Z" />
      <path d="M20 23c6 0 10-4 10-10-6 0-10 4-10 10Z" />
    </>
  ),
  vase: (
    <>
      <path d="M16 7h8M17 7c0 4-6 6-6 14 0 7 4 12 9 12s9-5 9-12c0-8-6-10-6-14" />
    </>
  ),
  rug: (
    <>
      <path d="M8 10h24v20H8z" />
      <path d="M12 14h16v12H12zM20 14v12M12 20h16" />
      <path d="M8 7v3M12 7v3M28 7v3M32 7v3M8 30v3M12 30v3M28 30v3M32 30v3" />
    </>
  ),
  window: (
    <>
      <path d="M9 7h22v26H9zM20 7v26" />
      <path d="M12 12l5-3M12 17l7-5M23 26l5-4" />
    </>
  ),
  remote: (
    <>
      <path d="M14 6h12v28H14z" />
      <circle cx="20" cy="13" r="3" />
      <path d="M17 21h6M17 25h6" />
    </>
  ),
  layers: (
    <>
      <path d="M6 15 20 8l14 7-14 7z" />
      <path d="m6 21 14 7 14-7M6 27l14 7 14-7" />
    </>
  ),
};

export const iconKeys = Object.keys(paths);

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name] ?? paths.layers}
    </svg>
  );
}
