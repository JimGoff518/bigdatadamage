# Image Shot List — Texas Data Center Watchdog

> **⚠️ DEPRECATED — DO NOT AI-GENERATE THESE (policy change 2026-07-11).**
> The site no longer uses AI-generated images. Source all imagery as **real, commercial-use-licensed
> stock** (existing Fiverr library in `/Images`, or a Shutterstock purchase). AI images created a
> credibility risk for a fact-based Texas site (and carried a visible generator watermark). Keep the
> filenames below as the site's slots, but fill them with licensed photos only.
> The prompts below are retained for reference on the intended *composition* — not for generation.

Use the **exact filenames** below; drop the licensed file into `public/images/` and the site picks
it up automatically (dark gradient overlays keep headline text readable). Optimize before committing
(resize to the widths noted, mozjpeg q80) — see `scripts/` for the sharp workflow.

## House style (applies to every shot)
- **Cinematic, documentary, investigative.** No smiling lawyers, no gavels, no scales of justice,
  no generic stock.
- **Mood:** ominous, David-vs-Goliath. Texas land dwarfed by industrial infrastructure.
- **Grade:** desaturated / muted. (If we go full ProPublica look → deliver **black & white**.
  If we keep the burnt-orange theme → **desaturated with a warm dusk cast**. See the open
  visual-direction decision; generate B&W-friendly compositions either way.)
- **Format:** landscape, high-res. No text baked in (we overlay type in code).

## Filenames the site auto-detects (drop files here with these exact names)
- `hero-fenceline.jpg` — homepage hero background
- `harm-water.jpg`, `harm-air.jpg`, `harm-property.jpg` — the three Damage hub headers
- `location-granbury.jpg`, `location-red-oak.jpg`, `location-midlothian.jpg`, `location-corsicana.jpg`, `location-abilene.jpg` — each location hub header
- `pillar-grid.jpg` — for the future Eminent Domain / Grid pillar (not wired yet)

Missing files fail silently (the dark fallback shows), so add them whenever you're ready.

## Shots

### 1. `hero-fenceline.jpg` — Home hero  (2400×1400, landscape)
> A lone Texas barbed-wire fence line and a windmill in a dry pasture at dusk, dwarfed by a
> massive 150-foot steel high-voltage transmission tower and a sprawling, windowless data center
> on the horizon. A few cattle in silhouette. Dramatic low sun, long shadows, desaturated cinematic
> color, documentary realism, wide aerial-ish angle. Ominous scale contrast.

### 2. `pillar-grid.jpg` — Eminent Domain / Grid Grab pillar (1920×1080)
> Endless 765-kV high-voltage transmission towers marching in a straight line across Texas
> ranchland, cutting through a farmer's field, surveyor stakes in the foreground. Overcast,
> desaturated, foreboding. Sense of land being taken.

### 3. `harm-water.jpg` — Water / Aquifer Squeeze hub (1920×1080)
> A cracked-dry Texas stock tank / empty cattle pond with a windmill, next to a giant industrial
> data center with cooling infrastructure and water pipes. Drought, dust, desaturated. The water
> is gone.

### 4. `harm-air.jpg` — Air pollution (1920×1080)
> Rows of large industrial diesel backup generators beside a data center, faint haze/exhaust
> drifting toward a distant rural neighborhood at dusk. Muted, gritty, documentary.

### 5. `harm-property.jpg` — Property / noise (1920×1080)
> A modest Texas farmhouse and porch in the foreground with a colossal windowless data center and
> roaring cooling-fan wall looming just past the property fence. Uncomfortable proximity,
> desaturated, cinematic.

### 6. `location-generic.jpg` — Default location-hub banner (1920×1080)
> Aerial twilight view of rural Texas acreage and county roads with a data center construction site
> and transmission corridor encroaching. Desaturated, map-like, investigative.

## Optional per-location banners
Name as `location-<slug>.jpg` (e.g. `location-granbury.jpg`) to override the generic banner for a
specific town. Same style; feature that area's recognizable landscape if known.
