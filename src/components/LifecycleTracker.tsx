import type { CSSProperties } from "react";
import type { LegislationItem } from "@/lib/legislation";
import { getLifecycle, HEARING_VIDEO } from "@/lib/legislation";

// Local date formatter (kept here to avoid a circular import with cards.tsx).
function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// Where a bill / statute / ordinance sits in the legislative lifecycle, drawn as
// a tracer line: each stage has its own color (a golden-hour ramp), completed
// stages fill in, the current stage glows, a died item stops at a red marker.
// Hovering a dot shows the date that stage was reached; a committee stage links
// to live hearing video. Pure CSS animation (no client JS) — the fill width is
// an inline `--fill` custom property; prefers-reduced-motion shows the resting
// state. See globals.css.
export function LifecycleTracker({
  item,
  variant = "card",
}: {
  item: LegislationItem;
  variant?: "card" | "detail";
}) {
  const { track, currentIndex, terminal, terminalLabel } = getLifecycle(item);
  const n = track.length;
  const last = Math.max(1, n - 1);
  const fillPct = (currentIndex / last) * 100;
  const detail = variant === "detail";
  const current = track[currentIndex];
  const dates = item.stageDates ?? {};

  const DANGER = "var(--color-danger)";
  const curColor = terminal ? DANGER : current.color;
  const fillStyle: CSSProperties = {
    background: `linear-gradient(to right, ${track[0].color}, ${curColor})`,
  };
  const inCommittee = !terminal && current.key === "committee";

  const summary = terminal
    ? `${terminalLabel} at stage ${currentIndex + 1} of ${n}, ${current.label}`
    : `Stage ${currentIndex + 1} of ${n}, ${current.label}`;

  return (
    <div className={detail ? "mt-3" : "mt-4"}>
      <div
        className="lifecycle"
        role="img"
        aria-label={`Legislative progress — ${summary}`}
        style={{ "--fill": `${fillPct}%` } as CSSProperties}
      >
        <div className="lifecycle-inner" aria-hidden="true">
          <div className="lifecycle-rail">
            <span className="lifecycle-fill" style={fillStyle} />
          </div>
          {track.map((s, i) => {
            const isCurrent = i === currentIndex;
            const isDone = i < currentIndex;
            const cls = isCurrent ? (terminal ? "is-terminal" : "is-current") : isDone ? "is-done" : "is-todo";
            const dotColor = isCurrent ? curColor : isDone ? s.color : "";
            const date = dates[s.key] ? fmtDate(dates[s.key]) : "";
            const dotStyle = {
              left: `${(i / last) * 100}%`,
              ...(dotColor ? { "--dot": dotColor } : {}),
            } as CSSProperties;
            return (
              <span
                key={s.key}
                className={`lifecycle-dot ${cls}`}
                style={dotStyle}
                title={`${s.label}${date ? ` · ${date}` : ""} — ${s.blurb}`}
              />
            );
          })}
        </div>
      </div>

      {/* Compact caption for the card. */}
      {!detail && (
        <p className="mt-2.5 text-[11px] font-semibold">
          {terminal ? (
            <span style={{ color: DANGER }}>
              {terminalLabel} · {current.label}
            </span>
          ) : (
            <span className="text-fg-dim">
              Stage {currentIndex + 1} of {n} · {current.label}
            </span>
          )}
          {item.stageNote ? <span className="text-fg-dim"> · {item.stageNote}</span> : null}
        </p>
      )}

      {/* Full stage list for the detail page. */}
      {detail && (
        <>
          <ol className="mt-6 space-y-3">
            {track.map((s, i) => {
              const done = i < currentIndex;
              const now = i === currentIndex;
              const date = dates[s.key] ? fmtDate(dates[s.key]) : "";
              return (
                <li key={s.key} className="flex gap-3">
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold"
                    style={
                      now
                        ? { backgroundColor: curColor, color: "var(--color-paper)" }
                        : done
                          ? { backgroundColor: s.color, color: "var(--color-paper)" }
                          : { border: "1px solid var(--color-line)", color: "var(--color-fg-dim)" }
                    }
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        now ? "text-fg" : done ? "text-fg/80" : "text-fg-dim"
                      }`}
                    >
                      {s.label}
                      {now ? (terminal ? ` — ${terminalLabel} here` : " — current stage") : ""}
                      {date ? (
                        <span className="ml-2 text-xs font-normal text-fg-dim">{date}</span>
                      ) : null}
                    </p>
                    <p className="text-sm leading-relaxed text-fg/60">{s.blurb}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {item.stageNote && <p className="mt-4 text-sm italic text-fg/70">{item.stageNote}</p>}

          {inCommittee && (
            <div className="mt-6">
              {item.chamber === "senate" || item.chamber === "house" ? (
                <a
                  href={HEARING_VIDEO[item.chamber]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-orange px-4 py-2 text-sm font-bold text-paper transition-colors hover:bg-orange-bright"
                >
                  ▶ Watch the {item.chamber === "senate" ? "Senate" : "House"} hearing
                </a>
              ) : (
                <p className="text-sm text-fg/70">
                  Watch live committee testimony:{" "}
                  <a
                    href={HEARING_VIDEO.house}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-orange underline"
                  >
                    House
                  </a>
                  {" · "}
                  <a
                    href={HEARING_VIDEO.senate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-orange underline"
                  >
                    Senate
                  </a>
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
