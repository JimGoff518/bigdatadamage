import {
  getFacilities,
  FACILITY_STATUS_META,
  type Facility,
} from "@/lib/facilities";

// The full, text-based inventory of tracked data centers — rendered under the
// map on /locations. The map shows geographic spread; this list makes every
// facility visible (and indexable/linkable, which the map's SVG pins are not).
// Grouped by county, each entry links out to its public source record.
export function FacilityList() {
  const facilities = getFacilities();
  if (facilities.length === 0) return null;

  const byCounty = new Map<string, Facility[]>();
  for (const f of facilities) {
    const key = f.county || "Other";
    if (!byCounty.has(key)) byCounty.set(key, []);
    byCounty.get(key)!.push(f);
  }
  const counties = [...byCounty.keys()].sort((a, b) => a.localeCompare(b));

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="rounded-md border border-line bg-panel p-6 shadow-card sm:p-8">
        <p className="eyebrow text-[11px] text-hazard">The tracker</p>
        <h2 className="mt-2 text-2xl font-bold text-fg">
          Every data center on the tracker
        </h2>
        <p className="mt-1 text-sm text-fg-dim">
          {facilities.length} facilities across {counties.length} Texas counties.
          Each links to its public source record.
        </p>

        <div className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {counties.map((county) => {
            const list = byCounty.get(county)!;
            return (
              <div key={county}>
                <h3 className="flex items-baseline gap-1.5 border-b border-line pb-1 text-sm font-bold uppercase tracking-wide text-fg">
                  {county} County
                  <span className="font-normal text-fg-dim">({list.length})</span>
                </h3>
                <ul className="mt-2 space-y-2">
                  {list.map((f) => {
                    const meta = FACILITY_STATUS_META[f.status];
                    return (
                      <li key={f.slug} className="flex items-start gap-2 text-sm">
                        <span
                          className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ring-1 ring-paper"
                          style={{ background: meta.colorVar }}
                          aria-hidden
                        />
                        <span className="leading-snug">
                          <span className="font-semibold text-fg">{f.name}</span>
                          {f.city ? (
                            <span className="text-fg-dim"> · {f.city}</span>
                          ) : null}
                          <span className="text-fg-dim"> — {meta.label}</span>
                          {f.sourceUrl ? (
                            <>
                              {" · "}
                              <a
                                href={f.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange hover:underline"
                              >
                                source
                              </a>
                            </>
                          ) : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
