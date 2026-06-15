import { FenceLine } from "@/components/FenceLine";

export function PageHeader({
  eyebrow,
  title,
  intro,
  image,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  // Optional background photo. Uses CSS background so a missing file fails
  // silently (no broken-image icon) and falls back to the dark treatment.
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-night text-fg">
      {image && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-night/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/65 to-night/30" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 grid-texture opacity-50" />
      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-20 sm:pt-16 sm:pb-24">
        {eyebrow && (
          <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl">
          {title}
        </h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-fg/75">{intro}</p>}
      </div>
      <FenceLine className="absolute bottom-0 left-0 h-16 w-full text-black/60" />
    </section>
  );
}
