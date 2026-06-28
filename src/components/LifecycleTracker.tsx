import type { CSSProperties } from "react";
import type { LegislationItem } from "@/lib/legislation";
import { getLifecycle } from "@/lib/legislation";

// Where a bill / statute / ordinance sits in the legislative lifecycle, drawn as
// a tracer line: completed stages fill in, the current stage glows, and an item
// that died stops at a red marker. Pure CSS animation (no client JS) — the fill
// width comes from an inline `--fill` custom property and animates once on load;
// prefers-reduced-motion shows the resting filled state. See globals.css.
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
            <span className={`lifecycle-fill${terminal ? " is-terminal" : ""}`} />
          </div>
          {track.map((s, i) => {
            const cls =
              i === currentIndex
                ? terminal
                  ? "is-terminal"
                  : "is-current"
                : i < currentIndex
                  ? "is-done"
                  : "is-todo";
            return (
              <span
                key={s.key}
                className={`lifecycle-dot ${cls}`}
                style={{ left: `${(i / last) * 100}%` }}
                title={`${s.label} — ${s.blurb}`}
              />
            );
          })}
        </div>
      </div>

      {/* Compact caption for the card. */}
      {!detail && (
        <p className="mt-2.5 text-[11px] font-semibold">
          {terminal ? (
            <span style={{ color: "var(--color-danger)" }}>
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
              return (
                <li key={s.key} className="flex gap-3">
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold"
                    style={
                      now
                        ? {
                            backgroundColor: terminal
                              ? "var(--color-danger)"
                              : "var(--color-orange)",
                            color: "var(--color-paper)",
                          }
                        : done
                          ? { backgroundColor: "var(--color-orange)", color: "var(--color-paper)" }
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
                    </p>
                    <p className="text-sm leading-relaxed text-fg/60">{s.blurb}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          {item.stageNote && <p className="mt-4 text-sm italic text-fg/70">{item.stageNote}</p>}
        </>
      )}
    </div>
  );
}
