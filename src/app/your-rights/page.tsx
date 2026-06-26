import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your Rights: Texas Groundwater, Nuisance & Property Law vs. Data Centers",
  description:
    "How Texas law protects landowners when a data center moves in next door — groundwater ownership, the Rule of Capture and its limits, subsidence, nuisance, and GCD permits, with the controlling Texas cases.",
  alternates: { canonical: "/your-rights" },
};

type Section = { title: string; body: string; authority?: string };

const sections: Section[] = [
  {
    title: "The groundwater under your land is your property",
    body: "This is the point most people miss. In Texas, the groundwater beneath your land is not just a resource the state rations out — it is your property. The Texas Supreme Court held that a landowner owns the groundwater in place beneath the surface as a vested real-property interest, the same way the law treats the oil and gas under your feet. That ownership has teeth: a court has held that severely restricting a landowner's permitted groundwater can amount to a regulatory taking that requires compensation. When a corporate facility next door pumps millions of gallons a day, it is competing with a property right the law recognizes as yours.",
    authority:
      "Edwards Aquifer Authority v. Day, 369 S.W.3d 814 (Tex. 2012); Bragg v. Edwards Aquifer Authority, 421 S.W.3d 118 (Tex. App. 2013).",
  },
  {
    title: "The Rule of Capture — and its real limits",
    body: "Texas follows the “rule of capture”: a landowner may generally pump water from beneath their land even if it draws down a neighbor's well, and the Texas Supreme Court has repeatedly declined to replace that rule with a “reasonable use” standard. But the rule has never been absolute. A landowner may not pump maliciously to harm a neighbor, may not willfully waste water, and may be held liable for negligently causing a neighbor's land to sink. For an industrial site pumping at a scale no household ever could, those limits are not footnotes — they are where a landowner's leverage begins.",
    authority:
      "Houston & Texas Central Railway Co. v. East (Tex. 1904); Sipriano v. Great Spring Waters of America, Inc., 1 S.W.3d 75 (Tex. 1999); City of Corpus Christi v. City of Pleasanton, 276 S.W.2d 798 (Tex. 1955); Friendswood Development Co. v. Smith-Southwest Industries, Inc., 576 S.W.2d 21 (Tex. 1978).",
  },
  {
    title: "Subsidence — when the ground itself sinks",
    body: "When an aquifer is over-pumped, the land above it can sink, cracking foundations, slabs, roads, and irrigation infrastructure. Texas law treats this as more than bad luck. The Texas Supreme Court held that a landowner who negligently causes subsidence on a neighbor's property can be liable for that damage — a harm separate from, and in addition to, the loss of the water itself. Aggressive, closely-spaced, high-volume pumping is exactly the conduct that can cross the line from lawful capture into negligence.",
    authority: "Friendswood Development Co. v. Smith-Southwest Industries, Inc., 576 S.W.2d 21 (Tex. 1978).",
  },
  {
    title: "Private nuisance — your peace and quiet at home",
    body: "Owning land includes the right to actually use and enjoy it. When someone's activity substantially and unreasonably interferes with that use — through constant noise, dust, odor, fumes, or light — Texas law calls it a private nuisance. The Texas Supreme Court has recognized that conditions like foul odors, dust, noise, and bright lights can be a nuisance when they would substantially disturb a person of ordinary sensibilities, and Texas courts have specifically weighed industrial noise and light as nuisance. The round-the-clock, low-frequency hum of cooling fans that ruins sleep and makes a home hard to live in is precisely the kind of interference this law was built to address. (When people talk about a right to the “quiet enjoyment” of their home against a neighbor, this nuisance framework is usually the doctrine that actually applies.)",
    authority:
      "Schneider National Carriers, Inc. v. Bates, 147 S.W.3d 264 (Tex. 2004); Rankin v. FPL Energy, LLC, 266 S.W.3d 506 (Tex. App. 2008).",
  },
  {
    title: "Groundwater Conservation District (GCD) permits & protests",
    body: "Most Texas groundwater is managed locally by Groundwater Conservation Districts. The Legislature did not create GCDs to rubber-stamp industry — it called them “the state's preferred method of groundwater management” precisely because they are meant to protect property rights while balancing conservation and development. GCDs can require permits and adopt rules to prevent waste and control subsidence, and the Texas Supreme Court has upheld that regulatory authority. For a landowner, the permit process is often the single most direct point of leverage — and it is usually most effective before a permit is finalized, not after.",
    authority:
      "Tex. Water Code §§ 36.0015, 36.001; Barshop v. Medina County Underground Water Conservation District, 925 S.W.2d 618 (Tex. 1996); South Plains Lamesa Railroad v. High Plains Underground Water Conservation District No. 1, 52 S.W.3d 770 (Tex. App. 2001).",
  },
  {
    title: "Diminution of property value",
    body: "Harm to your property is not only about comfort — it can be measured in dollars. Texas measures nuisance damages by the reduction in your property's market value, judged by its highest and best use, not merely its current use. Whether a nuisance is treated as “permanent” or “temporary” affects how that lost value is calculated. If a data center makes your home harder to sell, or sellable only at a steep discount, that lost value is a concrete, recognized financial injury — not just a feeling.",
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
                  <Icon name="shield" width={20} height={20} className="text-orange" />
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
