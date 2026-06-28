"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icons";
import { getCoverage, type CoverageVideo } from "@/content/coverage";

function fmtDate(iso: string): string {
  // Parse as local midnight to avoid TZ drift on a date-only string.
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

function StationBadge({ station }: { station: string }) {
  return (
    <span className="rounded-sm border border-line bg-panel-2 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-orange">
      {station}
    </span>
  );
}

function Highlight({ video }: { video: CoverageVideo }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-panel shadow-card">
      <div className="aspect-video w-full bg-panel-2">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${video.id}`}
          title={`${video.station}: ${video.title}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <StationBadge station={video.station} />
          <span className="text-[11px] text-fg-dim">{fmtDate(video.date)}</span>
        </div>
        {video.caption && <p className="mt-2 text-sm text-fg">{video.caption}</p>}
        <a
          href={watchUrl(video.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange hover:underline"
        >
          Watch on YouTube
          <Icon name="arrow" width={14} height={14} />
        </a>
      </div>
    </div>
  );
}

export function LocalCoverage({ slug, city }: { slug: string; city: string }) {
  const videos = getCoverage(slug);
  const [open, setOpen] = useState(false);

  if (videos.length === 0) return null;

  const highlights = videos.filter((v) => v.highlight);
  const rest = videos
    .filter((v) => !v.highlight)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first

  return (
    <>
      <Reveal className="mt-14">
        <h2 className="text-2xl font-bold text-fg">Local TV coverage</h2>
        <p className="mt-2 max-w-2xl text-fg-dim">
          {videos.length} reports from WFAA and CBS Texas tracking the {city} data center fight.
        </p>
      </Reveal>

      {highlights.length > 0 && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {highlights.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.06}>
              <Highlight video={v} />
            </Reveal>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <Reveal className="mt-6">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-sm border border-line bg-panel px-4 py-2 text-sm font-semibold text-fg shadow-card hover:border-orange"
          >
            {open ? "Hide" : "See"} all {videos.length} WFAA &amp; CBS Texas reports
            <span className={`transition-transform ${open ? "rotate-90" : ""}`}>
              <Icon name="arrow" width={14} height={14} />
            </span>
          </button>

          {open && (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-md border border-line bg-panel shadow-card">
              {rest.map((v) => (
                <li key={v.id}>
                  <a
                    href={watchUrl(v.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-1 p-4 hover:bg-panel-2 sm:flex-row sm:items-center sm:gap-3"
                  >
                    <span className="flex shrink-0 items-center gap-2">
                      <StationBadge station={v.station} />
                      <span className="text-[11px] text-fg-dim">{fmtDate(v.date)}</span>
                    </span>
                    <span className="text-sm text-fg">{v.title}</span>
                    <Icon name="arrow" width={14} height={14} className="hidden shrink-0 text-orange sm:block sm:ml-auto" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      )}

      <p className="mt-4 text-xs text-fg-dim">
        Videos are hosted on YouTube by the respective stations. BigDataDamage links to and embeds
        original reporting — we don&apos;t host or alter footage.
      </p>
    </>
  );
}
