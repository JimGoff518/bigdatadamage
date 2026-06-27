import type { FeatureCollection } from "geojson";
import { locations } from "@/content/locations";
import { getFacilities } from "@/lib/facilities";
import { TexasMapClient } from "./TexasMapClient";

// Server Component: reads the reviewed, source-linked facilities (filesystem, via
// getFacilities) and the communities we cover, converts both to GeoJSON, and hands
// them to the client MapLibre map as props. The "never render an unsourced pin"
// guard lives in getFacilities() and is unchanged. The water overlay is loaded by
// the client directly from /public, not passed through here.

// Longitude/latitude for the communities that get a marker. Slugs map to
// content/locations.ts; only places with coordinates are plotted.
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

export function TexasMap() {
  const facilities: FeatureCollection = {
    type: "FeatureCollection",
    features: getFacilities().map((f) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [f.lng, f.lat] },
      properties: {
        slug: f.slug,
        name: f.name,
        status: f.status,
        city: f.city ?? "",
        county: f.county ?? "",
        sourceUrl: f.sourceUrl,
        sourceName: f.sourceName ?? "",
        note: f.note ?? "",
      },
    })),
  };

  const cities: FeatureCollection = {
    type: "FeatureCollection",
    features: locations
      .filter((l) => CITY_LL[l.slug])
      .map((l) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: CITY_LL[l.slug] },
        properties: {
          slug: l.slug,
          city: l.city,
          county: l.county,
          hot: Boolean(l.hot),
        },
      })),
  };

  // County name (matches the Census NAMELSAD, e.g. "Hood County") -> the
  // communities we cover there, for the county-overlay click popup.
  const countyCommunities: Record<string, { slug: string; city: string }[]> = {};
  for (const l of locations) {
    (countyCommunities[l.county] ??= []).push({ slug: l.slug, city: l.city });
  }

  return (
    <TexasMapClient
      facilities={facilities}
      cities={cities}
      countyCommunities={countyCommunities}
    />
  );
}
