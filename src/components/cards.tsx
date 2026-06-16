import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/articles";
import type { Topic } from "@/content/topics";
import type { Location } from "@/content/locations";
import { topics } from "@/content/topics";
import { Icon } from "@/components/Icons";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function HarmTag({ harm }: { harm?: string }) {
  const topic = topics.find((t) => t.slug === harm);
  if (!topic) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-line bg-panel-2 px-2 py-0.5 text-xs font-semibold text-hazard">
      <Icon name={topic.icon} width={12} height={12} />
      {topic.name}
    </span>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col rounded-md border border-line bg-panel p-5 shadow-card transition-all hover:-translate-y-1 hover:border-orange/60"
    >
      {article.image && (
        <div className="relative -mx-5 -mt-5 mb-4 aspect-[16/9] overflow-hidden rounded-t-md">
          <Image
            src={article.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <HarmTag harm={article.harm} />
        <time className="text-xs text-fg-dim">{formatDate(article.date)}</time>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug text-fg group-hover:text-orange">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg/65">{article.excerpt}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange">
        Read more <Icon name="arrow" width={16} height={16} />
      </span>
    </Link>
  );
}

const accentBar: Record<string, string> = {
  water: "bg-teal",
  ember: "bg-hazard",
  alarm: "bg-orange",
};

export function HarmCard({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/damage/${topic.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-panel shadow-card transition-all hover:-translate-y-1 hover:border-orange/60"
    >
      <span className={`h-1.5 w-full ${accentBar[topic.accent] ?? "bg-orange"}`} />
      <div className="flex flex-1 flex-col p-6">
        <span className="grid h-12 w-12 place-items-center rounded-sm bg-orange text-night">
          <Icon name={topic.icon} width={26} height={26} />
        </span>
        <h3 className="mt-4 text-xl font-bold text-fg">{topic.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-fg/65">{topic.short}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange">
          See the damage <Icon name="arrow" width={16} height={16} />
        </span>
      </div>
    </Link>
  );
}

export function LocationCard({ location }: { location: Location }) {
  return (
    <Link
      href={`/locations/${location.slug}`}
      className="group flex items-center justify-between rounded-md border border-line bg-panel px-5 py-4 shadow-card transition-colors hover:border-orange"
    >
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-fg group-hover:text-orange">{location.city}</h3>
          {location.hot && (
            <span className="rounded-sm bg-orange px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-night">
              Hotspot
            </span>
          )}
        </div>
        <p className="text-xs text-fg-dim">
          {location.county}
          {location.aquifer ? ` · ${location.aquifer}` : ""}
        </p>
      </div>
      <Icon name="arrow" width={18} height={18} className="text-orange" />
    </Link>
  );
}
