// Build the Texas county-boundaries overlay GeoJSON for the interactive map.
//
// Source data: U.S. Census Bureau, 2023 Cartographic Boundary Shapefiles —
// counties (cb_2023_us_county_500k). U.S. federal work, public domain.
// The script downloads the national file and clips to Texas (STATEFP 48).
//
//   npm run build:counties   (requires devDependency: mapshaper; needs network)
//
// Output: ~195 KB GeoJSON with NAME ("Hood"), NAMELSAD ("Hood County"), GEOID.

import mapshaper from "mapshaper";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

const SRC_URL =
  "https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip";

const OUT = path.join(
  import.meta.dirname,
  "..",
  "public",
  "geo",
  "texas-counties.geojson",
);

// Download + unzip to a temp dir (mapshaper reads .shp from the zip directly).
const tmpZip = path.join(os.tmpdir(), "cb_2023_us_county_500k.zip");
if (!fs.existsSync(tmpZip)) {
  console.log("Downloading Census county boundaries…");
  const res = await fetch(SRC_URL);
  if (!res.ok) {
    console.error(`Download failed: HTTP ${res.status} ${SRC_URL}`);
    process.exit(1);
  }
  fs.writeFileSync(tmpZip, Buffer.from(await res.arrayBuffer()));
}

await mapshaper.runCommands(
  [
    `-i "${tmpZip}"`,
    "-proj wgs84",
    "-filter \"STATEFP==='48'\"", // Texas
    "-filter-fields NAME,NAMELSAD,GEOID",
    "-simplify 12% keep-shapes",
    `-o "${OUT}" force precision=0.0001`,
  ].join(" "),
);
console.log("Wrote", OUT);
