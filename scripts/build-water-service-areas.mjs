// Build the Texas water-service-areas overlay GeoJSON for the interactive map.
//
// Source data: USGS, "Public-Supply Water Service Areas Within the Conterminous
// United States, 2017" — ScienceBase DOI 10.5066/P9I22Z24 (U.S. federal work,
// public domain). The raw national shapefile (WSA_v1, ~316 MB) is NOT committed
// to this repo. To regenerate:
//
//   1. Download WSA_v1.zip from https://doi.org/10.5066/P9I22Z24 and unzip it.
//   2. Point WSA_SRC at the unzipped WSA_v1.shp (or use the default path below).
//   3. npm run build:water   (requires devDependency: mapshaper)
//
// What this does: reproject NAD83 Albers (EPSG:5070) -> WGS84, keep only Texas
// areas, drop unused columns, simplify geometry, round coordinates. Output is a
// ~1.8 MB GeoJSON the web map loads directly. Re-run when USGS publishes a new
// WSA version.

import mapshaper from "mapshaper";
import path from "node:path";
import fs from "node:fs";

const SRC =
  process.env.WSA_SRC ||
  "C:/Users/jim/OneDrive/Documents/Fight For Water/For Maps/WSA_v1.shp";

// Output to public/ so the map fetches it by URL (kept out of the JS bundle/HTML).
const OUT = path.join(
  import.meta.dirname,
  "..",
  "public",
  "geo",
  "texas-water-service-areas.geojson",
);

if (!fs.existsSync(SRC)) {
  console.error(
    `Source shapefile not found: ${SRC}\n` +
      `Download WSA_v1.zip from https://doi.org/10.5066/P9I22Z24, unzip it, ` +
      `and set WSA_SRC to the WSA_v1.shp path.`,
  );
  process.exit(1);
}

const cmd = [
  `-i "${SRC}"`,
  "-proj wgs84",
  // STATE_NAME holds full names ("Texas"); filter to TX only.
  `-filter "STATE_NAME && STATE_NAME.indexOf('Texas')>-1"`,
  // WSA_NAME = label, TPOPSRV = population served, WSA_SQKM = area, WSA_AGIDF = id.
  "-filter-fields WSA_NAME,WSA_AGIDF,TPOPSRV,WSA_SQKM",
  // keep-shapes prevents dropping small polygons at this aggressive simplification.
  "-simplify 8% keep-shapes",
  `-o "${OUT}" force precision=0.0001`,
].join(" ");

await mapshaper.runCommands(cmd);
console.log("Wrote", OUT);
