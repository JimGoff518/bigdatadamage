import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icons";
import { site } from "@/lib/site";
import { studyCategories, actionGuides, type EvidenceType } from "@/content/studies";

export const metadata: Metadata = {
  title: "Research & Studies: Data Centers and Health",
  description:
    "A curated, plain-English library of the studies and agency reports on how data centers affect human and livestock health — noise, diesel emissions, water, and the low-frequency hum. Each study links to the full text at its source.",
  alternates: { canonical: "/resources" },
};

const evidenceLabel: Record<EvidenceType, string> = {
  direct: "Direct evidence",
  modeled: "Modeled estimate",
  analogous: "Analogous evidence",
};

const evidenceStyle: Record<EvidenceType, string> = {
  direct: "border-orange/60 bg-orange/10 text-orange",
  modeled: "border-hazard/50 bg-hazard/10 text-hazard",
  analogous: "border-line bg-night/5 text-fg-dim",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research & studies"
        title="The evidence, gathered in one place"
        intro="Every study and agency report below links to the full text at its original source — so you can read and download the real thing, not our summary of it. We label how directly each one bears on data centers, in plain English."
      />

      <section className="mx-auto max-w-3xl px-4 py-16">
        {/* Honest framing — kept short, per-category labels do the rest */}
        <Reveal>
          <div className="rounded-md border border-line bg-panel p-5 text-sm leading-relaxed text-fg/75 shadow-card">
            <p>
              <strong className="text-fg">How to read this library.</strong> Direct,
              data-center-specific health studies are still rare. Much of the strongest science
              measures the same exposures — constant noise, diesel exhaust, heavy water use — in
              other settings and applies by analogy. We tag each entry{" "}
              <span className="font-semibold text-orange">Direct</span>,{" "}
              <span className="font-semibold text-hazard">Modeled</span>, or{" "}
              <span className="font-semibold text-fg">Analogous</span> so you always know which is
              which.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 space-y-14">
          {studyCategories.map((cat) => (
            <div key={cat.slug} id={cat.slug} className="scroll-mt-24">
              <Reveal>
                <h2 className="flex items-center gap-2.5 text-2xl font-bold text-fg">
                  <Icon name={cat.icon} width={24} height={24} className="text-orange" />
                  {cat.title}
                </h2>
                <p className="mt-2 leading-relaxed text-fg/70">{cat.intro}</p>
              </Reveal>

              <div className="mt-5 space-y-4">
                {cat.studies.map((s, i) => (
                  <Reveal key={s.url} delay={(i % 3) * 0.05}>
                    <article className="rounded-md border border-line bg-panel p-6 shadow-card">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-sm border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${evidenceStyle[s.evidence]}`}
                        >
                          {evidenceLabel[s.evidence]}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-fg-dim">
                          {s.kind}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-bold leading-snug text-fg">{s.title}</h3>
                      <p className="mt-1 text-sm font-medium text-fg-dim">
                        {s.source} · {s.year}
                      </p>
                      <p className="mt-3 leading-relaxed text-fg/75">{s.summary}</p>

                      {s.file ? (
                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                          <a
                            href={s.file}
                            download
                            className="inline-flex items-center gap-2 text-sm font-bold text-orange hover:underline"
                          >
                            <Icon name="download" width={16} height={16} />
                            Download study (PDF)
                          </a>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-dim hover:text-orange"
                          >
                            <Icon name="doc" width={13} height={13} />
                            View at source{s.license ? ` · ${s.license}` : ""}
                          </a>
                        </div>
                      ) : (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange hover:underline"
                        >
                          <Icon name={s.pdf ? "download" : "doc"} width={16} height={16} />
                          {s.pdf ? "Read / download the full study (PDF)" : "Read the full study at the source"}
                        </a>
                      )}
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Turn the research into action */}
        <Reveal>
          <div className="mt-16 border-t border-line pt-12">
            <h2 className="text-2xl font-bold text-fg">From research to action</h2>
            <p className="mt-2 leading-relaxed text-fg/70">
              Guides on this site that help you use the evidence above — to protest a permit,
              protect your rights, and preserve what matters if a facility is already affecting your
              land.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {actionGuides.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group rounded-md border border-line bg-panel p-5 shadow-card transition-colors hover:border-orange/60"
                >
                  <h3 className="flex items-start justify-between gap-2 font-bold text-fg">
                    {g.title}
                    <Icon
                      name="arrow"
                      width={18}
                      height={18}
                      className="mt-0.5 shrink-0 text-orange transition-transform group-hover:translate-x-0.5"
                    />
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg/70">{g.blurb}</p>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="cta-band mt-16 rounded-md p-8 text-night">
          <h2 className="text-2xl font-bold">Think a data center is harming your property?</h2>
          <p className="mt-1 font-medium text-night/80">
            Bring us what you&apos;re seeing — noise logs, a dry well, a stalled home sale. We&apos;ll
            help you understand your options, free and confidential.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-sm bg-night px-5 py-3 font-bold text-paper hover:bg-night/80">
              Get a free review
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

        <p className="mt-8 text-xs leading-relaxed text-fg-dim">
          Studies are summarized in our own words and linked to their original sources; we do not
          host third-party publications. Summaries are for general information and are not medical or
          legal advice.
        </p>
      </section>
    </>
  );
}
