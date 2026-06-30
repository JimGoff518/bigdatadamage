// Build the Texas Groundwater Conservation District (GCD) overlay GeoJSON for
// the interactive map.
//
// Source data: Texas Water Development Board, "Groundwater Conservation
// Districts" GIS layer (TWDB_GCD_NOV2019; source data from TCEQ, current as of
// November 2019). Texas public-government data — provided under a liability
// disclaimer only, no copyright/redistribution restriction. TWDB states these
// boundaries are APPROXIMATE and may not depict legal descriptions; that caveat
// must be surfaced wherever this layer is shown. The raw shapefile (~5 MB) is
// NOT committed to this repo. To regenerate:
//
//   1. Download GCD_Shapefiles.zip from https://www.twdb.texas.gov/mapping/gisdata.asp
//      and unzip it.
//   2. Point GCD_SRC at the unzipped TWDB_GCD_NOV2019.shp (or use the default).
//   3. npm run build:gcds   (requires devDependency: mapshaper)
//
// What this does: reproject to WGS84, keep only the two name fields (canonical +
// short), simplify geometry, round coordinates. Output is a small GeoJSON the
// web map loads by URL. Re-run when TWDB publishes a newer GCD layer.

import mapshaper from "mapshaper";
import path from "node:path";
import fs from "node:fs";

const SRC =
  process.env.GCD_SRC ||
  "C:/Users/jim/OneDrive/Documents/Fight For Water/For Maps/GCD/TWDB_GCD_NOV2019.shp";

const OUT = path.join(
  import.meta.dirname,
  "..",
  "public",
  "geo",
  "texas-gcds.geojson",
);

if (!fs.existsSync(SRC)) {
  console.error(
    `Source shapefile not found: ${SRC}\n` +
      `Download GCD_Shapefiles.zip from https://www.twdb.texas.gov/mapping/gisdata.asp, ` +
      `unzip it, and set GCD_SRC to the TWDB_GCD_NOV2019.shp path.`,
  );
  process.exit(1);
}

// DISTNAME = full district name (canonical, always present);
// SHORTNAM = friendlier label ("Uvalde County UWCD").
const cmd = [
  `-i "${SRC}"`,
  "-proj wgs84",
  "-rename-fields GCD_NAME=DISTNAME,GCD_SHORT=SHORTNAM",
  "-filter-fields GCD_NAME,GCD_SHORT",
  // keep-shapes prevents dropping small polygons at this simplification level.
  "-simplify 8% keep-shapes",
  `-o "${OUT}" force precision=0.0001`,
].join(" ");

await mapshaper.runCommands(cmd);
console.log("Wrote", OUT);
