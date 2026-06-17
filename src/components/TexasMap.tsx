import { locations } from "@/content/locations";

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
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Map of Texas data center hotspots"
    >
      <path d={TX_PATH} fill="var(--color-panel)" stroke="var(--color-line)" strokeWidth="3" strokeLinejoin="round" />
      {locations.map((loc) => {
        const ll = CITY_LL[loc.slug];
        if (!ll) return null;
        const { x, y } = project(ll[0], ll[1]);
        return (
          <a key={loc.slug} href={`/locations/${loc.slug}`}>
            <title>{`${loc.city}, ${loc.county}`}</title>
            <circle cx={x} cy={y} r="16" fill="var(--color-orange)" opacity="0.18" />
            <circle cx={x} cy={y} r="7" fill="var(--color-orange)" stroke="var(--color-night)" strokeWidth="2" />
            <text
              x={x + 13}
              y={y + 5}
              fontSize="19"
              fontWeight="700"
              fill="var(--color-fg)"
              className="font-display"
            >
              {loc.city}
            </text>
          </a>
        );
      })}
    </svg>
  );
}
