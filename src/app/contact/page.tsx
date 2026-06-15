import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { LeadForm } from "@/components/LeadForm";
import { Icon } from "@/components/Icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tell Us What's Happening Near You",
  description:
    "Free, confidential review for Texas landowners affected by a data center's water use, emissions, noise, or impact on property value.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact / tip line"
        title="Tell us what's happening near you"
        intro="If a data center is affecting your property in Texas, you may have legal options. Share the details — it's free and confidential."
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-5 md:items-start">
          <Reveal className="md:col-span-2">
            <h2 className="text-2xl font-bold text-fg">Prefer to talk?</h2>
            <a
              href={site.phoneHref}
              className="mt-4 inline-flex items-center gap-2 rounded-sm bg-orange px-5 py-3 text-lg font-bold text-night transition-colors hover:bg-orange-bright"
            >
              <Icon name="phone" width={18} height={18} />
              {site.phone}
            </a>
            <ul className="mt-8 space-y-4 text-sm text-fg/80">
              <li className="flex gap-3">
                <Icon name="shield" width={20} height={20} className="mt-0.5 shrink-0 text-orange" />
                Free, confidential review of your situation.
              </li>
              <li className="flex gap-3">
                <Icon name="water" width={20} height={20} className="mt-0.5 shrink-0 text-orange" />
                We focus on Texas water, air, noise, and property-value harm.
              </li>
              <li className="flex gap-3">
                <Icon name="home" width={20} height={20} className="mt-0.5 shrink-0 text-orange" />
                Individual landowners and property owners welcome.
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-3">
            <LeadForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
