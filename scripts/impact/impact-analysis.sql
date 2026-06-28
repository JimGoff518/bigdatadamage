-- BDD CARTO Impact Analysis — core (DO-free) metrics
-- Creates three output tables in carto-dw-ac-iq24z7xp.shared
-- Inputs: data_centers (79 pts), texas-water-service-areas (2234 polys), tx_counties (254 polys)

-- 1) PER-FACILITY ------------------------------------------------------------
CREATE OR REPLACE TABLE `carto-dw-ac-iq24z7xp`.shared.impact_by_facility AS
WITH dc AS (
  SELECT slug, name, operator, city, status, county AS county_raw, geom,
         ST_X(geom) AS lng, ST_Y(geom) AS lat
  FROM `carto-dw-ac-iq24z7xp`.shared.data_centers
),
dc_county AS (  -- authoritative county via spatial join
  SELECT dc.slug,
         ANY_VALUE(c.name) AS county_name,
         ANY_VALUE(c.namelsad) AS county_namelsad
  FROM dc JOIN `carto-dw-ac-iq24z7xp`.shared.tx_counties c
    ON ST_INTERSECTS(dc.geom, c.geom)
  GROUP BY dc.slug
),
dc_water AS (  -- containing water service area (each DC verified in <=1)
  SELECT dc.slug,
         ANY_VALUE(w.wsa_name) AS water_district_name,
         ANY_VALUE(w.wsa_agidf) AS water_district_id,
         MAX(w.tpopsrv) AS water_district_pop,
         COUNT(*) AS n_districts
  FROM dc JOIN `carto-dw-ac-iq24z7xp`.shared.`texas-water-service-areas` w
    ON ST_INTERSECTS(dc.geom, w.geom)
  GROUP BY dc.slug
)
SELECT
  dc.slug, dc.name, dc.operator, dc.city, dc.status,
  COALESCE(cty.county_namelsad, dc.county_raw) AS county,
  cty.county_name,
  dc.lat, dc.lng,
  (dcw.slug IS NOT NULL) AS in_water_district,
  dcw.water_district_name,
  dcw.water_district_id,
  dcw.water_district_pop
FROM dc
LEFT JOIN dc_county cty USING (slug)
LEFT JOIN dc_water dcw USING (slug);

-- 2) PER-COUNTY --------------------------------------------------------------
CREATE OR REPLACE TABLE `carto-dw-ac-iq24z7xp`.shared.impact_by_county AS
WITH counts AS (
  SELECT
    county,
    COUNT(*) AS total_dcs,
    COUNTIF(status = 'operating') AS dcs_operating,
    COUNTIF(status = 'under-construction') AS dcs_under_construction,
    COUNTIF(status = 'proposed') AS dcs_proposed,
    COUNTIF(status = 'permitted') AS dcs_permitted,
    COUNTIF(in_water_district) AS dcs_in_water_district
  FROM `carto-dw-ac-iq24z7xp`.shared.impact_by_facility
  GROUP BY county
),
distinct_districts AS (  -- distinct districts per county (district counted once per county)
  SELECT county,
         COUNT(*) AS affected_districts,
         SUM(water_district_pop) AS pop_in_affected_districts
  FROM (
    SELECT DISTINCT county, water_district_id, water_district_pop
    FROM `carto-dw-ac-iq24z7xp`.shared.impact_by_facility
    WHERE in_water_district
  )
  GROUP BY county
)
SELECT
  c.county,
  c.total_dcs, c.dcs_operating, c.dcs_under_construction, c.dcs_proposed, c.dcs_permitted,
  c.dcs_in_water_district,
  COALESCE(d.affected_districts, 0) AS affected_districts,
  COALESCE(d.pop_in_affected_districts, 0) AS pop_in_affected_districts
FROM counts c
LEFT JOIN distinct_districts d USING (county)
ORDER BY c.total_dcs DESC, c.county;

-- 3) STATEWIDE ---------------------------------------------------------------
CREATE OR REPLACE TABLE `carto-dw-ac-iq24z7xp`.shared.impact_statewide AS
WITH f AS (SELECT * FROM `carto-dw-ac-iq24z7xp`.shared.impact_by_facility),
dd AS (
  SELECT COUNT(*) AS distinct_affected_districts, SUM(water_district_pop) AS pop_served_affected
  FROM (SELECT DISTINCT water_district_id, water_district_pop FROM f WHERE in_water_district)
)
SELECT
  (SELECT COUNT(*) FROM f) AS total_dcs,
  (SELECT COUNTIF(in_water_district) FROM f) AS dcs_in_water_district,
  (SELECT COUNTIF(NOT in_water_district) FROM f) AS dcs_not_in_water_district,
  (SELECT dd.distinct_affected_districts FROM dd) AS distinct_affected_districts,
  (SELECT CAST(ROUND(dd.pop_served_affected) AS INT64) FROM dd) AS pop_served_affected,
  (SELECT COUNT(DISTINCT county) FROM f) AS counties_with_dcs,
  DATE('2026-06-28') AS generated_at;
