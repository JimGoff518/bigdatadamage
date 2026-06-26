import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Icon, type IconName } from "@/components/Icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your Rights: Texas Groundwater, Nuisance & Property Law vs. Data Centers",
  description:
    "How Texas law protects landowners when a data center moves in next door — groundwater ownership, the Rule of Capture and its limits, subsidence, nuisance, and GCD permits, with the controlling Texas cases.",
  alternates: { canonical: "/your-rights" },
};

type Section = { title: string; body: string; authority?: string; icon: IconName };

const sections: Section[] = [
  {
    icon: "water",
    title: "The groundwater under your land is your property",
    body: "In Texas, the groundwater beneath your land is your property — not just a resource the state rations out. The Texas Supreme Court held that a landowner owns the groundwater in place as a vested real-property interest, the same way the law treats the oil and gas under your feet. And courts have held that severely restricting it can amount to a compensable regulatory taking.",
    authority:
      "Edwards Aquifer Authority v. Day, 369 S.W.3d 814 (Tex. 2012); Bragg v. Edwards Aquifer Authority, 421 S.W.3d 118 (Tex. App. 2013).",
  },
  {
    icon: "scale",
    title: "The Rule of Capture — and its real limits",
    body: "Texas follows the “rule of capture”: you may generally pump water from beneath your land even if it draws down a neighbor's well, and the courts have repeatedly declined to adopt a “reasonable use” rule. But the rule has never been absolute — no malicious pumping, no willful waste, and liability for negligently causing a neighbor's land to sink. For an industrial-scale operation, those limits are where a landowner's leverage begins.",
    authority:
      "Houston & Texas Central Railway Co. v. East (Tex. 1904); Sipriano v. Great Spring Waters of America, Inc., 1 S.W.3d 75 (Tex. 1999); City of Corpus Christi v. City of Pleasanton, 276 S.W.2d 798 (Tex. 1955); Friendswood Development Co. v. Smith-Southwest Industries, Inc., 576 S.W.2d 21 (Tex. 1978).",
  },
  {
    icon: "subsidence",
    title: "Subsidence — when the ground itself sinks",
    body: "When an aquifer is over-pumped, the land above it can sink — cracking foundations, slabs, and roads. Texas law treats this as more than bad luck: a landowner who negligently causes subsidence on a neighbor's property can be liable for that damage, a harm separate from the loss of the water itself. High-volume, closely-spaced pumping is exactly the conduct that can cross from lawful capture into negligence.",
    authority: "Friendswood Development Co. v. Smith-Southwest Industries, Inc., 576 S.W.2d 21 (Tex. 1978).",
  },
  {
    icon: "sound",
    title: "Private nuisance — your peace and quiet at home",
    body: "Owning land includes the right to use and enjoy it. When an activity substantially and unreasonably interferes — through constant noise, dust, odor, or light — Texas law calls it a private nuisance. The round-the-clock, low-frequency hum of cooling fans that ruins sleep and makes a home hard to live in is exactly the kind of interference it addresses — and the real doctrine behind a neighbor's “quiet enjoyment.”",
    authority:
      "Schneider National Carriers, Inc. v. Bates, 147 S.W.3d 264 (Tex. 2004); Rankin v. FPL Energy, LLC, 266 S.W.3d 506 (Tex. App. 2008).",
  },
  {
    icon: "doc",
    title: "Groundwater Conservation District (GCD) permits & protests",
    body: "Most Texas groundwater is managed locally by Groundwater Conservation Districts. The Legislature calls them the state's “preferred method of groundwater management” — meant to protect property rights, not rubber-stamp industry. GCDs can require permits and adopt rules to prevent waste and subsidence, and the permit process is often a landowner's most direct leverage, especially before a permit is finalized.",
    authority:
      "Tex. Water Code §§ 36.0015, 36.001; Barshop v. Medina County Underground Water Conservation District, 925 S.W.2d 618 (Tex. 1996); South Plains Lamesa Railroad v. High Plains Underground Water Conservation District No. 1, 52 S.W.3d 770 (Tex. App. 2001).",
  },
  {
    icon: "home",
    title: "Diminution of property value",
    body: "Harm to your property isn't only about comfort — it can be measured in dollars. Texas measures nuisance damages by the reduction in your property's market value, judged by its highest and best use. If a data center makes your home harder to sell, or sellable only at a discount, that lost value is a concrete, recognized injury — not just a feeling.",
    authority:
      "Meat Producers, Inc. v. McFarland, 476 S.W.2d 406 (Tex. Civ. App. 1972); Schneider National Carriers, Inc. v. Bates, 147 S.W.3d 264 (Tex. 2004).",
  },
];

export default function YourRightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your rights"
        title="Texas water & property law, in plain English"
        intro="You don't need a law degree to understand what protects your land. Here are the concepts that matter most when a data center moves in next door — and the actual Texas cases and statutes behind them."
      />

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-5">
          {sections.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.05}>
              <div className="rounded-md border border-line bg-panel p-6 shadow-card">
                <h2 className="flex items-center gap-2 text-xl font-bold text-fg">
                  <Icon name={s.icon} width={20} height={20} className="text-orange" />
                  {s.title}
                </h2>
                <p className="mt-2 leading-relaxed text-fg/75">{s.body}</p>
                {s.authority && (
                  <p className="mt-3 border-t border-line/60 pt-3 text-sm text-fg/55">
                    <span className="font-bold text-orange">Key authority:</span> {s.authority}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-fg/60">
          This page is general information about Texas law, not legal advice about your specific
          property — every situation is fact-specific. The primary sources include the{" "}
          <a
            href="https://statutes.capitol.texas.gov/Docs/WA/htm/WA.36.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-fg"
          >
            Texas Water Code, Chapter 36
          </a>{" "}
          and the Texas court decisions cited above.
        </p>

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
