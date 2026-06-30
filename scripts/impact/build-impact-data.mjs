// Regenerate the CARTO impact data the site renders (src/content/impact/*.json).
//
// One command for the whole pipeline:
//   1. Consolidate src/content/facilities/*.json -> a data_centers GeoJSON
//   2. Import it into CARTO (carto_dw.shared.data_centers, overwrite)
//   3. Run the spatial analysis (impact-analysis.sql) -> 3 output tables
//   4. Export those tables -> src/content/impact/{statewide,by-county,by-facility}.json
//
// Prerequisites: CARTO CLI installed + authenticated (`npm i -g @carto/carto-cli`,
// `carto auth login`). The water-service-areas and tx_counties tables are static
// and already in carto_dw; this script only refreshes the data-center-derived
// numbers. Run: `npm run build:impact`.
//
// n8n hook: this same script (or steps 2-4) can run on a schedule to refresh the
// numbers whenever the facility discovery pipeline adds sites, then open a PR.

import { execSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const FACILITIES = join(ROOT, "src", "content", "facilities");
const OUT = join(ROOT, "src", "content", "impact");
const SQL = join(HERE, "impact-analysis.sql");

const CONN = "carto_dw";
const DS = "`carto-dw-ac-iq24z7xp`.shared";
const DEST = "carto-dw-ac-iq24z7xp.shared.data_centers";
const GENERATED_AT = new Date().toISOString().slice(0, 10);
const SOURCE =
  "USGS Public-Supply Water Service Areas (2017, DOI 10.5066/P9I22Z24); " +
  "US Census county boundaries (public domain); TWDB/TCEQ groundwater " +
  "conservation districts (approximate, 2019). Analysis by BigDataDamage.";

const sh = (cmd) => execSync(cmd, { stdio: "inherit" });
const json = (sql) =>
  JSON.parse(
    execSync(`carto sql query ${CONN} ${JSON.stringify(sql)} --json`, {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    }),
  ).rows;

// 1) consolidate facilities -> GeoJSON
const features = [];
const skipped = [];
for (const f of readdirSync(FACILITIES).filter(
  (f) => f.endsWith(".json") && !f.startsWith("_"),
)) {
  const d = JSON.parse(readFileSync(join(FACILITIES, f), "utf8"));
  const lat = Number(d.lat);
  const lng = Number(d.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    skipped.push(f);
    continue;
  }
  features.push({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: {
      slug: f.replace(/\.json$/, ""),
      name: d.name ?? "",
      operator: d.operator ?? "",
      county: d.county ?? "",
      city: d.city ?? "",
      status: d.status ?? "",
      source_url: d.sourceUrl ?? "",
      source_name: d.sourceName ?? "",
    },
  });
}
const tmp = join(tmpdir(), "bdd_data_centers.geojson");
writeFileSync(tmp, JSON.stringify({ type: "FeatureCollection", features }));
console.log(`Consolidated ${features.length} facilities` + (skipped.length ? ` (skipped ${skipped.length}: ${skipped.join(", ")})` : ""));

// 2) import into CARTO
sh(`carto import --file "${tmp}" --connection ${CONN} --destination "${DEST}" --overwrite`);

// 3) run the spatial analysis
sh(`carto sql job ${CONN} --file "${SQL}"`);

// 4) export the output tables -> committed JSON
mkdirSync(OUT, { recursive: true });

const sw = json(`SELECT * FROM ${DS}.impact_statewide`)[0];
writeFileSync(
  join(OUT, "statewide.json"),
  JSON.stringify(
    {
      totalDataCenters: sw.total_dcs,
      inWaterDistrict: sw.dcs_in_water_district,
      notInWaterDistrict: sw.dcs_not_in_water_district,
      distinctAffectedDistricts: sw.distinct_affected_districts,
      populationServedByAffectedDistricts: sw.pop_served_affected,
      countiesWithDataCenters: sw.counties_with_dcs,
      inGcd: sw.dcs_in_gcd,
      distinctGcds: sw.distinct_gcds,
      generatedAt: GENERATED_AT,
      source: SOURCE,
    },
    null,
    2,
  ) + "\n",
);

const counties = {};
for (const r of json(`SELECT * FROM ${DS}.impact_by_county ORDER BY total_dcs DESC, county`)) {
  counties[r.county] = {
    county: r.county,
    totalDataCenters: r.total_dcs,
    operating: r.dcs_operating,
    underConstruction: r.dcs_under_construction,
    proposed: r.dcs_proposed,
    permitted: r.dcs_permitted,
    inWaterDistrict: r.dcs_in_water_district,
    affectedDistricts: r.affected_districts,
    populationInAffectedDistricts: Math.round(r.pop_in_affected_districts),
  };
}
writeFileSync(
  join(OUT, "by-county.json"),
  JSON.stringify({ generatedAt: GENERATED_AT, source: SOURCE, counties }, null, 2) + "\n",
);

const facilities = {};
for (const r of json(`SELECT * FROM ${DS}.impact_by_facility ORDER BY slug`)) {
  facilities[r.slug] = {
    slug: r.slug,
    name: r.name,
    operator: r.operator,
    city: r.city,
    county: r.county,
    status: r.status,
    inWaterDistrict: r.in_water_district,
    waterDistrictName: r.water_district_name,
    waterDistrictPopulationServed: r.water_district_pop,
    inGcd: r.in_gcd,
    gcdName: r.gcd_short || r.gcd_name || null,
  };
}
writeFileSync(
  join(OUT, "by-facility.json"),
  JSON.stringify({ generatedAt: GENERATED_AT, source: SOURCE, facilities }, null, 2) + "\n",
);

console.log(
  `Wrote impact JSON: ${Object.keys(counties).length} counties, ${Object.keys(facilities).length} facilities -> ${OUT}`,
);
