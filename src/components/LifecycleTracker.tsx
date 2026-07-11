import type { CSSProperties, ReactNode } from "react";
import type { Lifecycle } from "@/lib/legislation";

// Local date formatter (kept here to avoid a circular import with cards.tsx).
function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// Where an item sits in a lifecycle, drawn as a tracer line: each stage has its
// own color (a golden-hour ramp), completed stages fill in, the current stage
// glows, a died/terminal item stops at a colored marker. Hovering a dot shows
// the date that stage was reached. Pure CSS animation (no client JS) — the fill
// width is an inline `--fill` custom property; prefers-reduced-motion shows the
// resting state. See globals.css.
//
// The component is domain-agnostic: pass a precomputed `lifecycle` (from
// getLifecycle for bills, getLitigationLifecycle for cases) plus any stage
// dates / note and an optional `footer` (e.g. the legislative hearing button).
export function LifecycleTracker({
  lifecycle,
  stageDates: stageDatesProp,
  stageNote,
  variant = "card",
  ariaLabel = "Progress",
  footer,
}: {
  lifecycle: Lifecycle;
  stageDates?: Record<string, string>;
  stageNote?: string;
  variant?: "card" | "detail";
  ariaLabel?: string;
  footer?: ReactNode;
}) {
  const { track, currentIndex, terminal, terminalLabel } = lifecycle;
  const n = track.length;
  const last = Math.max(1, n - 1);
  const fillPct = (currentIndex / last) * 100;
  const detail = variant === "detail";
  const current = track[currentIndex];
  const dates = stageDatesProp ?? {};

  const DANGER = "var(--color-danger)";
  const curColor = terminal ? (lifecycle.terminalColor ?? DANGER) : current.color;
  const fillStyle: CSSProperties = {
    background: `linear-gradient(to right, ${track[0].color}, ${curColor})`,
  };
  // Halo around the current/terminal dot, tinted to match its color (overrides
  // the CSS default so a positive "settled" reads green, not red).
  const haloStyle: CSSProperties = {
    boxShadow: `0 0 0 4px color-mix(in srgb, ${curColor} 25%, transparent)`,
  };

  const summary = terminal
    ? `${terminalLabel} at stage ${currentIndex + 1} of ${n}, ${current.label}`
    : `Stage ${currentIndex + 1} of ${n}, ${current.label}`;

  return (
    <div className={detail ? "mt-3" : "mt-4"}>
      <div
        className="lifecycle"
        role="img"
        aria-label={`${ariaLabel} — ${summary}`}
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
              ...(isCurrent ? haloStyle : {}),
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
            <span style={{ color: curColor }}>
              {terminalLabel} · {current.label}
            </span>
          ) : (
            <span className="text-fg-dim">
              Stage {currentIndex + 1} of {n} · {current.label}
            </span>
          )}
          {stageNote ? <span className="text-fg-dim"> · {stageNote}</span> : null}
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

          {stageNote && <p className="mt-4 text-sm italic text-fg/70">{stageNote}</p>}

          {footer}
        </>
      )}
    </div>
  );
}
