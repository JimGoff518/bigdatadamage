import { locations } from "@/content/locations";
import { getFacilities, FACILITY_STATUS_META, type FacilityStatus } from "@/lib/facilities";

// Texas state outline as [longitude, latitude] vertices, clockwise from the
// northwest corner of the Panhandle. Simplified but recognizable.
const TX_BORDER: [number, number][] = [
  [-103.04, 36.5], // Panhandle NW corner
  [-100.0, 36.5], // Panhandle NE corner
  [-100.0, 34.75], // down the east side of the Panhandle
  [-99.45, 34.4], // Red River begins
  [-98.1, 34.12],
  [-97.45, 33.84],
  [-96.4, 33.74],
  [-95.3, 33.87],
  [-94.5, 33.64],
  [-94.04, 33.55], // Texarkana / NE corner
  [-94.04, 32.1], // east border (Louisiana)
  [-93.82, 31.2], // Sabine River
  [-93.7, 30.3],
  [-93.85, 29.75], // Sabine Pass (Gulf)
  [-94.7, 29.35], // Gulf coast, Galveston
  [-95.3, 28.95],
  [-96.4, 28.4], // Matagorda
  [-97.05, 28.0],
  [-97.4, 27.5], // Corpus Christi
  [-97.15, 26.85],
  [-97.15, 26.07], // Rio Grande mouth / Brownsville
  [-98.25, 26.35], // Rio Grande heads northwest
  [-99.1, 26.4], // Laredo
  [-99.5, 27.5],
  [-100.4, 28.5], // Eagle Pass
  [-101.4, 29.8],
  [-102.4, 29.8],
  [-102.8, 29.2], // Big Bend dips south
  [-103.3, 29.0], // Big Bend tip
  [-104.0, 29.3],
  [-104.55, 29.7],
  [-105.3, 30.7],
  [-106.3, 31.5],
  [-106.62, 31.78], // El Paso (western tip)
  [-106.62, 32.0], // up the New Mexico border
  [-103.06, 32.0], // east along the New Mexico line
  [-103.06, 36.5], // up the west side of the Panhandle
];

const CITY_LL: Record<string, [number, number]> = {
  amarillo: [-101.83, 35.22],
  abilene: [-99.73, 32.45],
  sweetwater: [-100.41, 32.47],
  odessa: [-102.37, 31.85],
  granbury: [-97.79, 32.44],
  "red-oak": [-96.8, 32.52],
  midlothian: [-96.99, 32.48],
  "sulphur-springs": [-95.6, 33.14],
  corsicana: [-96.47, 32.1],
  hillsboro: [-97.13, 32.01],
  "waco-lacy-lakeview": [-97.15, 31.55],
  temple: [-97.34, 31.1],
  "san-marcos": [-97.94, 29.88],
  "corpus-christi": [-97.4, 27.8],
  harlingen: [-97.7, 26.19],
};

// Equirectangular projection, longitude compressed by cos(lat) so Texas isn't
// stretched. Both the outline and the pins use it, so pins land correctly.
const COS_LAT = Math.cos((31.5 * Math.PI) / 180);
const VIEW_W = 760;
const VIEW_H = 760;
const PAD_TB = 40; // top/bottom padding
const PAD_L = 30;
const PAD_R = 180; // extra room on the right for city labels

const projected = TX_BORDER.map(([lng, lat]) => [lng * COS_LAT, lat] as const);
const minX = Math.min(...projected.map((p) => p[0]));
const maxX = Math.max(...projected.map((p) => p[0]));
const minY = Math.min(...projected.map((p) => p[1]));
const maxY = Math.max(...projected.map((p) => p[1]));
const scale = Math.min(
  (VIEW_W - PAD_L - PAD_R) / (maxX - minX),
  (VIEW_H - 2 * PAD_TB) / (maxY - minY),
);
const offX = PAD_L + (VIEW_W - PAD_L - PAD_R - (maxX - minX) * scale) / 2;
const offY = PAD_TB + (VIEW_H - 2 * PAD_TB - (maxY - minY) * scale) / 2;

// Only the well-separated regional cities get a text label on the map; the
// dense DFW/Central cluster shows as dots (all named in the list beside the map)
// so labels never collide. side = which way the label points off its pin.
const LABELS: Record<string, "left" | "right"> = {
  amarillo: "right",
  odessa: "left",
  "sulphur-springs": "right",
  "san-marcos": "right",
  "corpus-christi": "right",
  harlingen: "right",
};

function project(lng: number, lat: number): { x: number; y: number } {
  return {
    x: offX + (lng * COS_LAT - minX) * scale,
    y: offY + (maxY - lat) * scale,
  };
}

const TX_PATH =
  TX_BORDER.map(([lng, lat], i) => {
    const { x, y } = project(lng, lat);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";

export function TexasMap() {
  const facilities = getFacilities();
  const statusKeys = Object.keys(FACILITY_STATUS_META) as FacilityStatus[];

  return (
    <div>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Map of Texas data center facilities, colored by permitting status, with the communities we cover"
      >
        <path d={TX_PATH} fill="var(--color-panel)" stroke="var(--color-line)" strokeWidth="3" strokeLinejoin="round" />

        {/* Tracked data centers, colored by status. Each pin is a reviewed,
            source-linked facility from src/content/facilities/. */}
        {facilities.map((f) => {
          const { x, y } = project(f.lng, f.lat);
          const { label, colorVar } = FACILITY_STATUS_META[f.status];
          const where = [f.city, f.county].filter(Boolean).join(", ");
          return (
            <g key={f.slug}>
              <title>{`${f.name}${where ? ` — ${where}` : ""} — ${label}`}</title>
              <circle cx={x} cy={y} r="13" fill={colorVar} opacity="0.18" />
              <circle cx={x} cy={y} r="6" fill={colorVar} stroke="var(--color-paper)" strokeWidth="1.5" />
            </g>
          );
        })}

      {locations.map((loc) => {
        const ll = CITY_LL[loc.slug];
        if (!ll) return null;
        const { x, y } = project(ll[0], ll[1]);
        const side = LABELS[loc.slug];
        return (
          <a key={loc.slug} href={`/locations/${loc.slug}`}>
            <title>{`${loc.city}, ${loc.county}`}</title>
            <circle cx={x} cy={y} r="15" fill="var(--color-orange)" opacity="0.18" />
            <circle cx={x} cy={y} r="7" fill="var(--color-orange)" stroke="var(--color-night)" strokeWidth="2" />
            {side && (
              <text
                x={side === "right" ? x + 13 : x - 13}
                y={y + 5}
                textAnchor={side === "right" ? "start" : "end"}
                fontSize="19"
                fontWeight="700"
                fill="var(--color-fg)"
                className="font-display"
              >
                {loc.city}
              </text>
            )}
          </a>
        );
      })}
      </svg>

      {/* Legend — color is never the only cue: every status is labeled here and
          repeated in each pin's hover tooltip. */}
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-label="Map legend: data center status">
        {statusKeys.map((s) => (
          <li key={s} className="flex items-center gap-2 text-sm text-fg-dim">
            <span
              className="inline-block h-3 w-3 rounded-full ring-1 ring-paper"
              style={{ background: FACILITY_STATUS_META[s].colorVar }}
            />
            {FACILITY_STATUS_META[s].label}
          </li>
        ))}
        <li className="flex items-center gap-2 text-sm text-fg-dim">
          <span className="inline-block h-3 w-3 rounded-full bg-orange/30 ring-2 ring-orange" />
          Community we cover
        </li>
      </ul>
    </div>
  );
}
