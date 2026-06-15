import { locations } from "@/content/locations";

// Approximate plot positions (stylized, not survey-accurate) within the viewBox.
const COORDS: Record<string, { x: number; y: number }> = {
  abilene: { x: 320, y: 395 },
  granbury: { x: 432, y: 362 },
  "red-oak": { x: 478, y: 360 },
  midlothian: { x: 458, y: 378 },
  corsicana: { x: 508, y: 415 },
};

const TX_PATH =
  "M305,95 L470,95 L470,255 L560,255 L560,300 L685,310 L705,395 L675,470 L715,560 " +
  "L650,635 L560,675 L490,720 L420,835 L360,745 L300,690 L250,620 L215,560 L205,595 " +
  "L150,500 L90,470 L140,435 L140,300 L305,300 Z";

export function TexasMap() {
  return (
    <svg viewBox="0 0 760 880" className="h-auto w-full" role="img" aria-label="Map of Texas data center hotspots">
      <path d={TX_PATH} fill="var(--color-panel)" stroke="var(--color-line)" strokeWidth="3" />
      {locations.map((loc) => {
        const c = COORDS[loc.slug];
        if (!c) return null;
        return (
          <a key={loc.slug} href={`/locations/${loc.slug}`}>
            <title>{`${loc.city}, ${loc.county}`}</title>
            <circle cx={c.x} cy={c.y} r="18" fill="var(--color-orange)" opacity="0.18" />
            <circle cx={c.x} cy={c.y} r="8" fill="var(--color-orange)" stroke="var(--color-night)" strokeWidth="2" />
            <text
              x={c.x + 16}
              y={c.y + 5}
              fontSize="22"
              fontWeight="700"
              fill="var(--color-fg)"
              className="font-display"
            >
              {loc.city}
            </text>
          </a>
        );
      })}
    </svg>
  );
}
