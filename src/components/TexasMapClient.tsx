"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, MapGeoJSONFeature } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";

// CARTO Positron — light vector basemap, no API key. Attribution shown in-map.
const BASEMAP = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
// USGS water-service-areas overlay (public domain). Fetched by URL, not bundled.
const WATER_URL = "/geo/texas-water-service-areas.geojson";
// US Census county boundaries (public domain), clipped to Texas.
const COUNTY_URL = "/geo/texas-counties.geojson";

// Hex values mirror the Golden-Hour theme vars in globals.css (MapLibre paints to
// canvas and can't read CSS variables).
const WATER_COLOR = "#356d92"; // --color-teal
const CITY_COLOR = "#a84a00"; // --color-orange
const COUNTY_COLOR = "#8a6d3b"; // warm brown county hairlines
const PAPER = "#fbf7ee"; // --color-paper (pin stroke)

// status -> label + pin color, mirrors FACILITY_STATUS_META in lib/facilities.ts.
const STATUS: { key: string; label: string; color: string }[] = [
  { key: "proposed", label: "Proposed", color: "#356d92" },
  { key: "permitted", label: "Permitted", color: "#7d520e" },
  { key: "under-construction", label: "Under construction", color: "#a84a00" },
  { key: "operating", label: "Operating", color: "#b91c1c" },
];
const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  STATUS.map((s) => [s.key, s.label]),
);
// MapLibre "match" expression: status string -> color, with a teal fallback.
const STATUS_COLOR_EXPR = [
  "match",
  ["get", "status"],
  ...STATUS.flatMap((s) => [s.key, s.color]),
  WATER_COLOR,
] as const;

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function TexasMapClient({
  facilities,
  cities,
  countyCommunities = {},
}: {
  facilities: FeatureCollection;
  cities: FeatureCollection;
  countyCommunities?: Record<string, { slug: string; city: string }[]>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);
  const [showWater, setShowWater] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showCounties, setShowCounties] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let map: MapLibreMap | undefined;

    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !containerRef.current) return;

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      map = new maplibregl.Map({
        container: containerRef.current,
        style: BASEMAP,
        center: [-99.4, 31.3],
        zoom: 4.5,
        minZoom: 4,
        maxZoom: 12,
        attributionControl: false,
        cooperativeGestures: true, // don't hijack page scroll
        fadeDuration: reduceMotion ? 0 : 300,
      });
      mapRef.current = map;

      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-left",
      );
      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution:
            "Water service areas: USGS, public domain (DOI 10.5066/P9I22Z24)",
        }),
        "bottom-right",
      );

      map.on("load", () => {
        if (cancelled || !map) return;

        // --- Water service areas (bottom overlay) ---
        map.addSource("water", { type: "geojson", data: WATER_URL });
        map.addLayer({
          id: "water-fill",
          type: "fill",
          source: "water",
          paint: { "fill-color": WATER_COLOR, "fill-opacity": 0.18 },
        });
        map.addLayer({
          id: "water-line",
          type: "line",
          source: "water",
          paint: {
            "line-color": WATER_COLOR,
            "line-opacity": 0.5,
            "line-width": 0.6,
          },
        });

        // --- Texas county boundaries (context layer; toggled, default off) ---
        map.addSource("counties", { type: "geojson", data: COUNTY_URL });
        map.addLayer({
          id: "county-fill", // invisible — captures clicks for the county popup
          type: "fill",
          source: "counties",
          layout: { visibility: "none" },
          paint: { "fill-color": "#000000", "fill-opacity": 0 },
        });
        map.addLayer({
          id: "county-line",
          type: "line",
          source: "counties",
          layout: { visibility: "none" },
          paint: {
            "line-color": COUNTY_COLOR,
            "line-opacity": 0.55,
            "line-width": 0.7,
          },
        });
        map.addLayer({
          id: "county-label",
          type: "symbol",
          source: "counties",
          minzoom: 6.5, // only label when zoomed in, or 254 names collide
          layout: {
            visibility: "none",
            "text-field": ["get", "NAME"],
            "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
            "text-size": 11,
          },
          paint: {
            "text-color": "#5f5443",
            "text-halo-color": "#fbf7ee",
            "text-halo-width": 1.2,
          },
        });

        // --- Communities we cover (orange rings) ---
        map.addSource("cities", { type: "geojson", data: cities });
        map.addLayer({
          id: "cities",
          type: "circle",
          source: "cities",
          paint: {
            "circle-radius": 7,
            "circle-color": CITY_COLOR,
            "circle-opacity": 0.16,
            "circle-stroke-color": CITY_COLOR,
            "circle-stroke-width": 2,
          },
        });

        // --- Data centers, colored by status (solid dots on top) ---
        map.addSource("facilities", { type: "geojson", data: facilities });
        map.addLayer({
          id: "facilities-halo",
          type: "circle",
          source: "facilities",
          paint: {
            "circle-radius": 9,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            "circle-color": STATUS_COLOR_EXPR as any,
            "circle-opacity": 0.18,
          },
        });
        map.addLayer({
          id: "facilities",
          type: "circle",
          source: "facilities",
          paint: {
            "circle-radius": 5,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            "circle-color": STATUS_COLOR_EXPR as any,
            "circle-stroke-color": PAPER,
            "circle-stroke-width": 1.5,
          },
        });

        // --- Popups ---
        const popup = new maplibregl.Popup({
          closeButton: true,
          maxWidth: "260px",
        });

        map.on("click", "facilities", (e) => {
          const f = e.features?.[0] as MapGeoJSONFeature | undefined;
          if (!f || !map) return;
          const p = f.properties ?? {};
          const where = [p.city, p.county].filter(Boolean).map(esc).join(", ");
          const status = STATUS_LABEL[String(p.status)] ?? esc(p.status);
          const src = p.sourceUrl
            ? `<a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener" style="color:#a84a00;font-weight:600">Source${p.sourceName ? `: ${esc(p.sourceName)}` : ""}</a>`
            : "";
          popup
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font-family:system-ui,sans-serif;font-size:13px;color:#2a2218">
                 <strong>${esc(p.name)}</strong><br/>
                 <span style="color:#5f5443">${status}${where ? ` — ${where}` : ""}</span>
                 ${p.note ? `<br/><span style="color:#5f5443">${esc(p.note)}</span>` : ""}
                 ${src ? `<br/>${src}` : ""}
               </div>`,
            )
            .addTo(map);
        });

        map.on("click", "cities", (e) => {
          const f = e.features?.[0] as MapGeoJSONFeature | undefined;
          if (!f || !map) return;
          const p = f.properties ?? {};
          popup
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font-family:system-ui,sans-serif;font-size:13px;color:#2a2218">
                 <strong>${esc(p.city)}</strong><br/>
                 <span style="color:#5f5443">${esc(p.county)}</span><br/>
                 <a href="/locations/${esc(p.slug)}" style="color:#a84a00;font-weight:600">Open ${esc(p.city)} →</a>
               </div>`,
            )
            .addTo(map);
        });

        map.on("click", "water-fill", (e) => {
          // Only show a water popup when no pin/city was clicked at this point.
          if (!map) return;
          const hits = map.queryRenderedFeatures(e.point, {
            layers: ["facilities", "cities"],
          });
          if (hits.length) return;
          const f = e.features?.[0] as MapGeoJSONFeature | undefined;
          if (!f) return;
          const p = f.properties ?? {};
          const pop = Number(p.TPOPSRV);
          popup
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font-family:system-ui,sans-serif;font-size:13px;color:#2a2218">
                 <strong>${esc(p.WSA_NAME)}</strong><br/>
                 <span style="color:#5f5443">Water service area${Number.isFinite(pop) && pop > 0 ? ` — serves ~${pop.toLocaleString()} people` : ""}</span>
               </div>`,
            )
            .addTo(map);
        });

        map.on("click", "county-fill", (e) => {
          if (!map) return;
          // Pins, communities, and water areas take priority — only show the
          // county popup when the click didn't land on one of those.
          const priority = ["facilities", "cities", "water-fill"].filter((l) =>
            map!.getLayer(l),
          );
          if (map.queryRenderedFeatures(e.point, { layers: priority }).length)
            return;
          const f = e.features?.[0] as MapGeoJSONFeature | undefined;
          if (!f) return;
          const p = f.properties ?? {};
          const name = String(p.NAMELSAD ?? p.NAME ?? "County");
          const comms = countyCommunities[name] ?? [];
          const links = comms.length
            ? comms
                .map(
                  (c) =>
                    `<a href="/locations/${esc(c.slug)}" style="color:#a84a00;font-weight:600">${esc(c.city)}</a>`,
                )
                .join(", ")
            : '<span style="color:#5f5443">No community we cover here yet</span>';
          popup
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font-family:system-ui,sans-serif;font-size:13px;color:#2a2218">
                 <strong>${esc(name)}</strong><br/>
                 <span style="color:#5f5443">Communities we cover:</span> ${links}
               </div>`,
            )
            .addTo(map);
        });

        for (const layer of ["facilities", "cities", "water-fill"]) {
          map.on("mouseenter", layer, () => {
            if (map) map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", layer, () => {
            if (map) map.getCanvas().style.cursor = "";
          });
        }

        setReady(true);
      });
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
      mapRef.current = null;
    };
  }, [facilities, cities]);

  // Toggle layer visibility.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const v = showWater ? "visible" : "none";
    for (const id of ["water-fill", "water-line"]) {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", v);
    }
  }, [showWater, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const v = showFacilities ? "visible" : "none";
    for (const id of ["facilities", "facilities-halo"]) {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", v);
    }
  }, [showFacilities, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const v = showCounties ? "visible" : "none";
    for (const id of ["county-line", "county-label", "county-fill"]) {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", v);
    }
  }, [showCounties, ready]);

  return (
    <div>
      <div className="relative">
        <div
          ref={containerRef}
          className="h-[460px] w-full overflow-hidden rounded-md border border-line sm:h-[560px]"
          role="application"
          aria-label="Interactive map of Texas data center facilities and public water-service areas. The communities we cover are also listed as links below the map."
        />
        {/* Layer toggles */}
        <fieldset className="absolute right-2 top-2 rounded-md border border-line bg-paper/95 px-3 py-2 text-sm shadow-card backdrop-blur">
          <legend className="sr-only">Map layers</legend>
          <label className="flex items-center gap-2 py-0.5 text-fg">
            <input
              type="checkbox"
              checked={showWater}
              onChange={(e) => setShowWater(e.target.checked)}
              className="accent-[#356d92]"
            />
            Water service areas
          </label>
          <label className="flex items-center gap-2 py-0.5 text-fg">
            <input
              type="checkbox"
              checked={showFacilities}
              onChange={(e) => setShowFacilities(e.target.checked)}
              className="accent-[#a84a00]"
            />
            Data centers
          </label>
          <label className="flex items-center gap-2 py-0.5 text-fg">
            <input
              type="checkbox"
              checked={showCounties}
              onChange={(e) => setShowCounties(e.target.checked)}
              className="accent-[#8a6d3b]"
            />
            County lines
          </label>
        </fieldset>
      </div>

      {/* Legend — color is never the only cue: every status is labeled here and in
          each pin's click popup. */}
      <ul
        className="mt-4 flex flex-wrap gap-x-5 gap-y-2"
        aria-label="Map legend"
      >
        {STATUS.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-sm text-fg-dim">
            <span
              className="inline-block h-3 w-3 rounded-full ring-1 ring-paper"
              style={{ background: s.color }}
            />
            {s.label}
          </li>
        ))}
        <li className="flex items-center gap-2 text-sm text-fg-dim">
          <span className="inline-block h-3 w-3 rounded-full bg-orange/30 ring-2 ring-orange" />
          Community we cover
        </li>
        <li className="flex items-center gap-2 text-sm text-fg-dim">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ background: WATER_COLOR, opacity: 0.35 }}
          />
          Water service area
        </li>
        <li className="flex items-center gap-2 text-sm text-fg-dim">
          <span
            className="inline-block h-0 w-4 self-center border-t-2"
            style={{ borderColor: COUNTY_COLOR }}
          />
          County line
        </li>
      </ul>
    </div>
  );
}
