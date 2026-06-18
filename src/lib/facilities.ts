import fs from "node:fs";
import path from "node:path";

// A data center we track on the map. One JSON file per facility lives in
// src/content/facilities/, written (as a reviewed PR) by the n8n discovery
// pipeline. Every field is meant to be FACTUAL and SOURCE-LINKED — see the
// validation in getFacilities(), which refuses to render any pin that isn't
// placeable in Texas and backed by a source URL. That guard is the code-level
// enforcement of the site's "never assert an unsourced facility" rule.

export type FacilityStatus =
  | "proposed"
  | "permitted"
  | "under-construction"
  | "operating";

export type Facility = {
  slug: string;
  name: string;
  operator?: string;
  city?: string;
  county?: string;
  lat: number;
  lng: number;
  status: FacilityStatus;
  harm?: string[]; // e.g. ["water","air","property"]
  sourceUrl: string; // public record / reporting the pin is based on
  sourceName?: string;
  note?: string; // one-line factual summary, in our own words
  dateFound?: string; // ISO date the pipeline surfaced it
};

const FACILITIES_DIR = path.join(process.cwd(), "src", "content", "facilities");

const STATUSES: FacilityStatus[] = [
  "proposed",
  "permitted",
  "under-construction",
  "operating",
];

// Rough Texas bounding box so a bad coordinate never drops a pin in the ocean
// (or in the wrong state) on a public, legal-advocacy map.
const TX_BOUNDS = { minLat: 25.5, maxLat: 36.7, minLng: -107.0, maxLng: -93.3 };

// Status → label + the CSS color variable used for its map pin and legend swatch.
export const FACILITY_STATUS_META: Record<
  FacilityStatus,
  { label: string; colorVar: string }
> = {
  proposed: { label: "Proposed", colorVar: "var(--color-teal)" },
  permitted: { label: "Permitted", colorVar: "var(--color-hazard)" },
  "under-construction": { label: "Under construction", colorVar: "var(--color-orange)" },
  operating: { label: "Operating", colorVar: "var(--color-danger)" },
};

export function getFacilities(): Facility[] {
  if (!fs.existsSync(FACILITIES_DIR)) return [];
  // Files starting with "_" are templates/docs, never rendered.
  const files = fs
    .readdirSync(FACILITIES_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  const out: Facility[] = [];
  for (const file of files) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(FACILITIES_DIR, file), "utf8"));
      const lat = Number(d.lat);
      const lng = Number(d.lng);

      // Reject anything not placeable, not status-typed, or not sourced.
      if (typeof d.name !== "string" || !d.name.trim()) continue;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      if (lat < TX_BOUNDS.minLat || lat > TX_BOUNDS.maxLat) continue;
      if (lng < TX_BOUNDS.minLng || lng > TX_BOUNDS.maxLng) continue;
      if (!STATUSES.includes(d.status)) continue;
      if (typeof d.sourceUrl !== "string" || !/^https?:\/\//i.test(d.sourceUrl)) continue;

      out.push({
        slug: file.replace(/\.json$/, ""),
        name: d.name.trim(),
        operator: typeof d.operator === "string" ? d.operator : undefined,
        city: typeof d.city === "string" ? d.city : undefined,
        county: typeof d.county === "string" ? d.county : undefined,
        lat,
        lng,
        status: d.status,
        harm: Array.isArray(d.harm)
          ? d.harm.filter((h: unknown): h is string => typeof h === "string")
          : undefined,
        sourceUrl: d.sourceUrl,
        sourceName: typeof d.sourceName === "string" ? d.sourceName : undefined,
        note: typeof d.note === "string" ? d.note : undefined,
        dateFound: typeof d.dateFound === "string" ? d.dateFound : undefined,
      });
    } catch {
      // A malformed file is skipped, never breaks the map.
      continue;
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
