type EdgeVariant = "wave" | "tear" | "arch" | "zig" | "scallop";

const PATHS: Record<EdgeVariant, string> = {
  wave: "M0 30C120 6 200 54 320 36 430 20 500 2 620 22 740 42 820 58 940 38 1040 22 1120 14 1200 26V64H0Z",
  tear: "M0 38 64 24 128 40 196 18 268 42 332 26 404 44 470 20 548 40 612 22 688 44 760 26 826 42 904 18 978 40 1046 24 1112 42 1168 26 1200 34V64H0Z",
  arch: "M0 64C240 2 960 2 1200 64Z",
  zig: "M0 44 86 20 172 44 258 20 344 44 430 20 516 44 602 20 688 44 774 20 860 44 946 20 1032 44 1118 20 1200 40V64H0Z",
  scallop:
    "M0 64V40Q60 8 120 40T240 40T360 40T480 40T600 40T720 40T840 40T960 40T1080 40T1200 40V64Z",
};

/**
 * A shaped transition between two colour bands. `color` is the colour of the
 * section the edge belongs to; the transparent part shows the section behind.
 * Put it at the bottom of a band, or flip it for the top.
 */
export function SectionEdge({
  variant = "wave",
  color,
  flip = false,
  className = "",
}: {
  variant?: EdgeVariant;
  color: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`band-edge ${flip ? "rotate-180" : ""} ${className}`}
      style={{ color }}
    >
      <path d={PATHS[variant]} fill="currentColor" />
    </svg>
  );
}
