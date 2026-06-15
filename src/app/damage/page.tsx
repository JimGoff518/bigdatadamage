import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { HarmCard } from "@/components/cards";
import { topics } from "@/content/topics";

export const metadata: Metadata = {
  title: "The Damage: How Data Centers Harm Texas Landowners",
  description:
    "Water depletion, air pollution, and property-value collapse — the three ways data centers harm Texas property owners, explained.",
};

export default function DamagePage() {
  return (
    <>
      <PageHeader
        eyebrow="The damage"
        title="How the data center boom harms Texas landowners"
        intro="Three distinct harms, all landing on the same families: stolen water, poisoned air, and ruined property value. Start with the one affecting you."
      />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {topics.map((topic, i) => (
            <Reveal key={topic.slug} delay={i * 0.08}>
              <HarmCard topic={topic} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
