/**
 * "Midnight Fence Line" — a Texas horizon silhouette used as a section divider/overlay.
 * Ranch fence + windmill + cattle, overshadowed by looming transmission towers.
 * Decorative only (aria-hidden). Renders in a single currentColor so it tints to context.
 */
export function FenceLine({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      fill="currentColor"
      aria-hidden
    >
      {/* ground */}
      <rect x="0" y="150" width="1200" height="10" />

      {/* transmission tower (left, tall, looming) */}
      <g>
        <polygon points="120,150 132,150 128,40 124,40" />
        <polygon points="98,150 110,150 126,55 122,55" opacity="0.85" />
        <polygon points="142,150 154,150 130,55 126,55" opacity="0.85" />
        <rect x="92" y="58" width="68" height="6" />
        <rect x="100" y="78" width="52" height="6" />
        <rect x="84" y="46" width="84" height="6" />
        <polygon points="84,46 126,30 168,46" />
      </g>

      {/* transmission tower (right) */}
      <g>
        <polygon points="1040,150 1052,150 1048,70 1044,70" />
        <rect x="1018" y="82" width="56" height="5" />
        <rect x="1026" y="98" width="40" height="5" />
        <polygon points="1018,72 1046,60 1074,72" />
      </g>

      {/* drooping power lines */}
      <path d="M126,40 C400,120 760,120 1046,64" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <path d="M126,52 C420,130 740,130 1046,80" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />

      {/* windmill */}
      <g transform="translate(300 0)">
        <polygon points="0,150 6,150 5,84 1,84" />
        <polygon points="-8,150 -2,150 2,96 -2,96" opacity="0.8" />
        <polygon points="14,150 8,150 4,96 8,96" opacity="0.8" />
        <circle cx="3" cy="80" r="4" />
        {/* blades */}
        <g transform="translate(3 80)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <rect key={deg} x="-1.4" y="-26" width="2.8" height="26" transform={`rotate(${deg})`} />
          ))}
        </g>
        <rect x="-2" y="64" width="3" height="14" transform="rotate(28 0 70)" />
      </g>

      {/* fence line */}
      <g>
        {Array.from({ length: 22 }).map((_, i) => (
          <rect key={i} x={460 + i * 30} y="118" width="4" height="32" />
        ))}
        <rect x="458" y="124" width="664" height="3" />
        <rect x="458" y="138" width="664" height="3" />
      </g>

      {/* cattle silhouettes */}
      <Cow x={540} />
      <Cow x={620} flip />
      <Cow x={720} />
    </svg>
  );
}

function Cow({ x, flip }: { x: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} 0) scale(${flip ? -1 : 1} 1)`}>
      <path d="M0,150 L0,134 Q2,126 10,126 L40,126 Q46,126 48,132 L50,118 L55,120 L52,150 L46,150 L46,134 L8,134 L8,150 Z" />
      <rect x="-7" y="116" width="12" height="9" rx="2" />
    </g>
  );
}
