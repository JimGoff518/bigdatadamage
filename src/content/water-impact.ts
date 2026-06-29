// Data for the /water-impact page — BigDataDamage's original overlay analysis of
// Texas data centers against public water-supply service areas. This is a
// CITABLE asset: every figure here must be reproducible from the methodology
// below. Figures are computed via spatial join (point-in-polygon) of our
// facility tracker against the USGS Public-Supply Water Service Areas layer.
//
// To refresh: re-run the overlay in CARTO against the current facility tracker
// + latest USGS WSA release, then update the numbers and `waterImpactUpdated`.
// Keep this consistent with the live tracker count in src/content/facilities/.

// ISO date the overlay below was last computed.
export const waterImpactUpdated = "2026-06-28";

export type ImpactStat = {
  value: string;
  label: string;
  /** Plain-English attribution shown under the stat. */
  source: string;
};

// Headline figures. 56 (inside districts) + 23 (well-reliant) = 79 tracked total.
export const waterImpactStats: ImpactStat[] = [
  {
    value: "79",
    label: "data centers tracked across Texas",
    source: "Big Data Damage facility tracker — each entry source-linked",
  },
  {
    value: "56",
    label: "fall inside a mapped public water-supply service area",
    source: "Overlay vs. USGS Public-Supply Water Service Areas (2017)",
  },
  {
    value: "13",
    label: "public water systems have a tracked data center in their territory",
    source: "Distinct USGS service areas containing ≥1 tracked facility",
  },
  {
    value: "5.25M",
    label: "Texans are served by those 13 water systems",
    source: "Combined USGS TPOPSRV (population served) for those systems",
  },
  {
    value: "23",
    label: "sit outside any mapped service area — typically well-reliant land",
    source: "Tracked facilities with no overlapping USGS service area",
  },
];

// Simple split chart: where the 79 tracked facilities draw their water context.
export const waterExposure: { label: string; value: number; tone: "orange" | "teal" }[] = [
  { label: "Inside a public water-supply service area", value: 56, tone: "orange" },
  { label: "Outside any mapped area (private wells / groundwater)", value: 23, tone: "teal" },
];

// The datasets behind the analysis — shown in the "How we measured this" box so a
// reader (or journalist) can verify and reproduce every number.
export const waterImpactSources: { name: string; detail: string; href: string }[] = [
  {
    name: "USGS Public-Supply Water Service Areas (2017)",
    detail:
      "Federal public-domain layer mapping the boundaries of U.S. public water systems and the population each serves (TPOPSRV field). DOI 10.5066/P9I22Z24.",
    href: "https://doi.org/10.5066/P9I22Z24",
  },
  {
    name: "Big Data Damage facility tracker",
    detail:
      "Our source-linked inventory of tracked Texas data centers. Every facility is placed by coordinate and backed by a public record or news report.",
    href: "/locations",
  },
];

// Honest limits — stated up front so the page reads as rigorous, not promotional.
export const waterImpactLimits: string[] = [
  "Shared supply, not consumption: a facility falling inside a water system's territory means it shares that public supply — it is not a measure of how much water the data center itself draws.",
  "The USGS service-area layer reflects 2017 boundaries; some systems have changed since.",
  "Our tracker is a curated, source-linked inventory of known Texas data centers, not an exhaustive census of every facility in the state.",
  "Population figures are the total served by each water system (USGS TPOPSRV), not the number of people affected by a data center.",
];

// Copy-ready citation for the page.
export const waterImpactCitation =
  "Big Data Damage. (2026). Texas Data Center Water Impact Analysis. https://www.bigdatadamage.com/water-impact";
