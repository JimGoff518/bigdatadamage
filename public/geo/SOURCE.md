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

