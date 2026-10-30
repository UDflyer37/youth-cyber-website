import type { MissionIcon } from "@/lib/missions";

type MissionArtProps = {
  slug: MissionIcon;
  accent: string;
  tint: string;
  className?: string;
  /** Small decorative posters drop the extra detail so they stay legible. */
  detail?: "full" | "simple";
  /** Crop to fill the frame instead of letterboxing (used by preview tiles). */
  slice?: boolean;
};

/**
 * Hand-drawn SVG posters, one per mission. These stand in for project previews
 * and stay sharp at any size without loading a single image.
 */
export function MissionArt({ slug, accent, tint, className = "", detail = "full", slice = false }: MissionArtProps) {
  const ratio = slice ? "xMidYMid slice" : "xMidYMid meet";
  const dotId = `dots-${slug}`;
  const gradientId = `wash-${slug}`;
  const base = (
    <>
      <rect width="320" height="260" fill={tint} />
      <defs>
        <pattern id={dotId} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.4" fill={accent} opacity="0.28" />
        </pattern>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="320" height="260" fill={`url(#${gradientId})`} />
      <rect width="320" height="260" fill={`url(#${dotId})`} opacity="0.7" />
    </>
  );

  if (slug === "lock") {
    return (
      <svg viewBox="0 0 320 260" className={className} aria-hidden="true" focusable="false" preserveAspectRatio={ratio}>
        {base}
        <rect x="28" y="30" width="74" height="10" rx="5" fill={accent} opacity="0.3" />
        <rect x="28" y="48" width="46" height="10" rx="5" fill={accent} opacity="0.18" />
        <path
          d="M160 44l58 23v58c0 34-26 60-58 73-32-13-58-39-58-73V67l58-23z"
          fill="#fffdf9"
          stroke={accent}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <circle cx="160" cy="122" r="15" fill={accent} />
        <path d="M160 134v30" stroke={accent} strokeWidth="7" strokeLinecap="round" />
        <rect x="44" y="176" width="232" height="52" rx="16" fill="#fffdf9" stroke={accent} strokeWidth="2.5" />
        {[86, 116, 146, 176, 206, 236].map((cx, index) => (
          <circle key={cx} cx={cx} cy="202" r="7" fill={accent} opacity={index === 5 ? 1 : 0.35} />
        ))}
        <rect x="247" y="192" width="2.5" height="20" rx="1.2" fill={accent} />
        <path d="M262 60l6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2 6-12z" fill={accent} opacity="0.35" />
      </svg>
    );
  }

  if (slug === "cipher") {
    return (
      <svg viewBox="0 0 320 260" className={className} aria-hidden="true" focusable="false" preserveAspectRatio={ratio}>
        {base}
        <circle cx="160" cy="132" r="86" fill="none" stroke={accent} strokeWidth="1.6" opacity="0.45" />
        <circle cx="160" cy="132" r="68" fill="#fffdf9" stroke={accent} strokeWidth="2.5" />
        <g stroke={accent} strokeWidth="1.4" opacity="0.5">
          {Array.from({ length: 26 }).map((_, index) => {
            const angle = (index / 26) * Math.PI * 2 - Math.PI / 2;
            const long = index % 5 === 0;
            const round = (value: number) => Math.round(value * 100) / 100;
            return (
              <line
                key={index}
                x1={round(160 + Math.cos(angle) * 74)}
                y1={round(132 + Math.sin(angle) * 74)}
                x2={round(160 + Math.cos(angle) * (long ? 84 : 79))}
                y2={round(132 + Math.sin(angle) * (long ? 84 : 79))}
              />
            );
          })}
        </g>
        <circle cx="160" cy="132" r="50" fill={accent} />
        <text
          x="160"
          y="152"
          textAnchor="middle"
          fill="#fffdf9"
          fontFamily="var(--font-fraunces), Georgia, serif"
          fontStyle="italic"
          fontWeight="700"
          fontSize="46"
        >
          Q
        </text>
        {"AKZ".split("").map((letter, index) => (
          <g key={letter}>
            <circle cx={[54, 268, 246][index]} cy={[92, 80, 206][index]} r="16" fill="#fffdf9" stroke={accent} strokeWidth="2" />
            <text
              x={[54, 268, 246][index]}
              y={[98, 86, 212][index]}
              textAnchor="middle"
              fill={accent}
              fontFamily="var(--font-bricolage), system-ui, sans-serif"
              fontWeight="700"
              fontSize="16"
            >
              {letter}
            </text>
          </g>
        ))}
        {detail === "full" ? (
          <path
            d="M212 150c22 18 34 2 28-12-5-13-26-10-26 5 0 16 24 22 38 10"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="5 6"
          />
        ) : null}
      </svg>
    );
  }

  if (slug === "hook") {
    return (
      <svg viewBox="0 0 320 260" className={className} aria-hidden="true" focusable="false" preserveAspectRatio={ratio}>
        {base}
        <g transform="rotate(-7 160 138)">
          <rect x="62" y="76" width="196" height="132" rx="12" fill="#fffdf9" stroke={accent} strokeWidth="3" />
          <path d="M62 90l98 66 98-66" fill="none" stroke={accent} strokeWidth="3" strokeLinejoin="round" />
          <path d="M62 196l64-48" stroke={accent} strokeWidth="2" opacity="0.4" />
          <path d="M258 196l-64-48" stroke={accent} strokeWidth="2" opacity="0.4" />
        </g>
        <circle cx="246" cy="74" r="30" fill="#fffdf9" stroke={accent} strokeWidth="3" />
        <path d="M246 58v20" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <circle cx="246" cy="88" r="3.4" fill={accent} />
        <path
          d="M52 214c0-22 18-38 40-38 20 0 34 12 34 28 0 13-10 22-22 22-9 0-16-6-16-14"
          fill="none"
          stroke={accent}
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path d="M42 40l8 16 18 3-13 12 3 18-16-8-16 8 3-18-13-12 18-3 8-16z" fill={accent} opacity="0.3" />
      </svg>
    );
  }

  if (slug === "blocks") {
    return (
      <svg viewBox="0 0 320 260" className={className} aria-hidden="true" focusable="false" preserveAspectRatio={ratio}>
        {base}
        <g transform="translate(46 34)">
          <rect x="0" y="0" width="104" height="88" rx="14" fill="#fffdf9" stroke={accent} strokeWidth="3" />
          <circle cx="52" cy="44" r="10" fill="none" stroke={accent} strokeWidth="2.4" opacity="0.5" />
          <rect x="120" y="0" width="108" height="88" rx="14" fill={accent} />
          <path d="M166 26l26 18-26 18z" fill="#fffdf9" />
          <rect x="0" y="104" width="104" height="88" rx="14" fill={accent} opacity="0.16" />
          <rect x="14" y="118" width="52" height="9" rx="4.5" fill={accent} opacity="0.7" />
          <rect x="14" y="136" width="36" height="9" rx="4.5" fill={accent} opacity="0.45" />
          <rect x="120" y="104" width="108" height="88" rx="14" fill="#fffdf9" stroke={accent} strokeWidth="3" />
          <path d="M138 148l14 14 34-36" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path d="M284 48l6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2 6-12z" fill={accent} opacity="0.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 260" className={className} aria-hidden="true" focusable="false" preserveAspectRatio={ratio}>
      {base}
      <rect x="40" y="46" width="240" height="176" rx="22" fill="#fffdf9" stroke={accent} strokeWidth="3" />
      <path
        d="M58 72v-8a10 10 0 0110-10h8M262 72v-8a10 10 0 00-10-10h-8M58 196v8a10 10 0 0010 10h8M262 196v8a10 10 0 01-10 10h-8"
        fill="none"
        stroke={accent}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cx="160" cy="140" rx="58" ry="68" fill={accent} opacity="0.12" />
      <ellipse cx="160" cy="140" rx="58" ry="68" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="7 8" />
      {[
        [132, 116],
        [188, 116],
        [160, 140],
        [130, 160],
        [190, 160],
        [160, 178],
      ].map(([cx, cy], index) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index < 2 ? 6 : 4.5} fill={accent} />
      ))}
      <path d="M140 168c8 9 32 9 40 0" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <path d="M40 184h240" stroke={accent} strokeWidth="2" strokeDasharray="4 8" opacity="0.6" />
      <circle cx="238" cy="184" r="4" fill={accent} />
      {detail === "full" ? (
        <text
          x="254"
          y="82"
          textAnchor="middle"
          fill={accent}
          fontFamily="var(--font-bricolage), system-ui, sans-serif"
          fontWeight="700"
          fontSize="15"
          opacity="0.75"
        >
          AI
        </text>
      ) : null}
    </svg>
  );
}
