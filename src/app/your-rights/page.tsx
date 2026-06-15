import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your Rights: Texas Water & Property Law vs. Data Centers",
  description:
    "Plain-English guide to the Texas legal concepts that matter when a data center affects your land — Rule of Capture, subsidence, nuisance, quiet enjoyment, and GCD permit protests.",
};

const sections = [
  {
    title: "The Rule of Capture — and its limits",
    body: "Texas groundwater generally follows the Rule of Capture: a landowner can pump water from beneath their land even if it draws from a neighbor's. But the rule is not absolute — willful waste, malicious pumping, and pumping that causes subsidence damage have all been recognized as limits.",
  },
  {
    title: "Subsidence",
    body: "When an aquifer is over-pumped, the ground above it can sink, crack foundations, and damage infrastructure. Negligently causing subsidence on a neighbor's property can be an actionable harm, separate from the water loss itself.",
  },
  {
    title: "Groundwater Conservation District (GCD) protests",
    body: "Most Texas groundwater is regulated locally by GCDs that oversee permits, spacing, and production. Landowners may be able to participate in — or formally protest — a facility's water permit, often the most direct point of leverage, and most effective before a permit is finalized.",
  },
  {
    title: "Private & public nuisance",
    body: "Texas common law lets landowners act when someone substantially and unreasonably interferes with the use and enjoyment of their property. Round-the-clock industrial noise and persistent emissions are classic examples courts evaluate as nuisance.",
  },
  {
    title: "Quiet enjoyment",
    body: "Every Texas property owner has a right to the quiet enjoyment of their land. Constant low-frequency fan noise that disrupts sleep and daily life can interfere with that right.",
  },
  {
    title: "Diminution of property value",
    body: "When a nearby facility makes your home harder to sell — or sellable only at a steep loss — that lost value is a concrete, measurable financial injury that the law can recognize.",
  },
];

export default function YourRightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your rights"
        title="Texas water & property law, in plain English"
        intro="You don't need a law degree to understand the basics of what protects your land. Here are the concepts that matter most when a data center moves in next door."
      />

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-5">
          {sections.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.05}>
              <div className="rounded-md border border-line bg-panel p-6 shadow-card">
                <h2 className="flex items-center gap-2 text-xl font-bold text-fg">
                  <Icon name="shield" width={20} height={20} className="text-orange" />
                  {s.title}
                </h2>
                <p className="mt-2 leading-relaxed text-fg/75">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="cta-band mt-10 rounded-md p-8 text-night">
          <h2 className="text-2xl font-bold">Not sure which applies to you?</h2>
          <p className="mt-1 font-medium text-night/80">
            That&apos;s normal — these are fact-specific questions. Tell us what&apos;s happening and
            we&apos;ll help you understand your options, free and confidential.
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
      </section>
    </>
  );
}
