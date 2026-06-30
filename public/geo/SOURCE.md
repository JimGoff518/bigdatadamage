# texas-water-service-areas.geojson — source & license

- **Dataset:** USGS, *Public-Supply Water Service Areas Within the Conterminous United States, 2017.*
- **DOI:** https://doi.org/10.5066/P9I22Z24
- **License:** U.S. Geological Survey work — **public domain** (no usage restriction).
- **Citation:** Buchwald, C.A., Houston, N.A., Stewart, J.S., York, B.C., and Valseth, K.J., 2022,
  Public-supply water service areas within the conterminous United States, 2017,
  U.S. Geological Survey data release, https://doi.org/10.5066/P9I22Z24.
- **Processing:** filtered to Texas, reprojected NAD83 Albers (EPSG:5070) → WGS84, simplified,
  coordinates rounded. Regenerate with `npm run build:water` (see `scripts/build-water-service-areas.mjs`).

Fields: `WSA_NAME` (system name), `TPOPSRV` (population served), `WSA_SQKM` (area km²), `WSA_AGIDF` (id).

## texas-counties.geojson — source & license

- **Dataset:** U.S. Census Bureau, 2023 Cartographic Boundary Shapefiles — counties (`cb_2023_us_county_500k`).
- **License:** U.S. Census Bureau work — **public domain** (no usage restriction).
- **Processing:** filtered to Texas (STATEFP 48), reprojected to WGS84, simplified, coordinates rounded.
  Regenerate with `npm run build:counties` (see `scripts/build-texas-counties.mjs`).

Fields: `NAME` ("Hood"), `NAMELSAD` ("Hood County"), `GEOID`.

## texas-gcds.geojson — source & license

- **Dataset:** Texas Water Development Board, *Groundwater Conservation Districts* (`TWDB_GCD_NOV2019`; source data from the Texas Commission on Environmental Quality).
- **URL:** https://www.twdb.texas.gov/mapping/gisdata.asp
- **Currency:** boundaries current as of **November 2019** (101 districts).
- **License:** Texas public-government data. TWDB asserts no copyright or redistribution restriction; the data is provided under a liability disclaimer only. Attribution used in-map: "Groundwater districts: TWDB/TCEQ (approximate, 2019)."
- **Accuracy caveat (MUST surface in UI):** TWDB states these boundaries are **approximate and may not accurately depict legal descriptions.** Do not present them as authoritative jurisdiction.
- **Processing:** reprojected to WGS84, kept name fields only (`DISTNAME`→`GCD_NAME`, `SHORTNAM`→`GCD_SHORT`), simplified, coordinates rounded. Regenerate with `npm run build:gcds` (see `scripts/build-gcds.mjs`).

Fields: `GCD_NAME` (full district name), `GCD_SHORT` (short label, e.g. "Uvalde County UWCD").

