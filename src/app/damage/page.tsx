import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icons";
import { topics } from "@/content/topics";
import { statsSource } from "@/content/stats";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Damage: How Data Centers Harm Texas Landowners",
  description:
    "Water depletion, diesel air pollution, and property-value collapse — the three ways the data center boom harms Texas property owners, with the Texas numbers behind each.",
  alternates: { canonical: "/damage" },
};

// Scale-setting figures. Every value links to where a reader can verify it.
const scaleStats: { value: string; label: string; href: string }[] = [
  { value: "248", label: "data centers planned across Texas", href: statsSource.href },
  { value: "519", label: "large grid-connection requests in two years", href: statsSource.href },
  { value: "3–9%", label: "of Texas' water they could use by 2040", href: statsSource.href },
  {
    value: "≈900M",
    label: "gallons a year a single Amarillo-area campus would draw",
    href: "/articles/project-matador-amarillo-water",
  },
];

// One hard proof point per harm, keyed by topic slug. Sourced or descriptive —
// never an unverifiable figure.
const proof: Record<string, { value: string; note: string; href: string }> = {
  water: {
    value: "56 of 79",
    note: "mapped Texas data centers already sit inside a groundwater district — sharing your aquifer.",
    href: "/locations",
  },
  air: {
    value: "32 → 65",
    note: "diesel backup generators one San Antonio data center is seeking TCEQ permission to run — more than doubling its approved fleet (air permit O4790).",
    href: "https://deceleration.news/data-centers-major-new-air-pollution-san-antonio/",
  },
  property: {
    value: "30+",
    note: "times police cited a Granbury data-center/crypto operator for breaking the 85-decibel noise limit — neighbors logged up to 87.9 dB at the property line.",
    href: "https://insideclimatenews.org/news/04102024/texas-bitcoin-mine-neighbors-file-nuisance-lawsuit/",
  },
};

export default function DamagePage() {
  return (
    <>
      <PageHeader
        eyebrow="The damage"
        title="What a data center next door actually does to you"
        intro="The benefits go elsewhere; the burdens land on the families nearby. Three distinct harms — stolen water, poisoned air, and ruined property value — and the Texas numbers behind each."
        image="/images/harm-water.jpg"
      />

      {/* The scale */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">The scale</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-bold text-fg sm:text-3xl">
            Texas is the country&apos;s number-one target for new data centers
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4">
          {scaleStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <Link href={s.href} className="group block h-full bg-panel p-6 transition-colors hover:bg-panel-2">
                <div className="font-display text-4xl font-bold text-orange sm:text-5xl">{s.value}</div>
                <div className="mt-2 text-sm leading-snug text-fg/70 group-hover:text-fg">{s.label}</div>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs text-fg-dim">
          <a href={statsSource.href} target="_blank" rel="noopener noreferrer" className="hover:text-orange">
            {statsSource.label}
          </a>
        </p>
      </section>

      {/* The three harms, in depth */}
      {topics.map((topic, i) => {
        const p = proof[topic.slug];
        const imageFirst = i % 2 === 0;
        return (
          <section key={topic.slug} className="border-t border-line">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-20">
              {/* Image */}
              <Reveal className={imageFirst ? "" : "lg:order-2"}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line shadow-card">
                  <Image
                    src={`/images/harm-${topic.slug}.jpg`}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 580px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-sm bg-orange text-paper shadow-card">
                    <Icon name={topic.icon} width={26} height={26} />
                  </span>
                </div>
              </Reveal>

              {/* Content */}
              <Reveal className={imageFirst ? "" : "lg:order-1"}>
                <p className="eyebrow border-l-4 border-orange pl-3 text-xs text-hazard">{topic.name}</p>
                <h2 className="mt-3 text-2xl font-bold text-fg sm:text-3xl">{topic.headline}</h2>
                <p className="mt-3 text-fg/70">{topic.intro}</p>

                <ul className="mt-6 space-y-3">
                  {topic.points.slice(0, 3).map((pt) => (
                    <li key={pt.title} className="flex gap-3">
                      <Icon name="arrow" width={18} height={18} className="mt-0.5 shrink-0 text-orange" />
                      <span className="text-sm leading-relaxed text-fg/75">
                        <strong className="font-semibold text-fg">{pt.title}.</strong> {pt.body}
                      </span>
                    </li>
                  ))}
                </ul>

                {p && (
                  <div className="mt-6 flex items-center gap-4 rounded-md border border-line bg-panel p-4 shadow-card">
                    <span className="font-display text-3xl font-bold text-orange">{p.value}</span>
                    <span className="text-sm leading-snug text-fg/70">
                      {p.note}{" "}
                      {p.href.startsWith("http") ? (
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-orange hover:underline"
                        >
                          See the source →
                        </a>
                      ) : (
                        <Link href={p.href} className="font-semibold text-orange hover:underline">
                          See for yourself →
                        </Link>
                      )}
                    </span>
                  </div>
                )}

                <Link
                  href={`/damage/${topic.slug}`}
                  className="mt-6 inline-flex items-center gap-1 font-semibold text-orange"
                >
                  See the full breakdown <Icon name="arrow" width={18} height={18} />
                </Link>
              </Reveal>
            </div>
          </section>
        );
      })}

      {/* Conversion */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="cta-band flex flex-col items-start gap-4 rounded-md p-8 text-night sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Is one of these happening near your property?</h2>
            <p className="mt-1 font-medium text-night/80">
              You may have legal options. Get a free, confidential review — no obligation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-sm bg-night px-5 py-3 font-bold text-paper hover:bg-night/80">
              Tell us what&apos;s happening
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 rounded-sm border border-night/40 px-5 py-3 font-bold text-night"
            >
              <Icon name="phone" width={16} height={16} />
              {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
