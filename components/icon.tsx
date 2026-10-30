import type { SVGProps } from "react";

export type IconName =
  | "shield"
  | "shield-check"
  | "lock"
  | "cipher"
  | "mail-warning"
  | "blocks"
  | "face"
  | "arrow-right"
  | "arrow-up-right"
  | "chevron-left"
  | "chevron-right"
  | "check"
  | "check-circle"
  | "x"
  | "sparkles"
  | "eye"
  | "eye-off"
  | "copy"
  | "refresh"
  | "clock"
  | "lightbulb"
  | "star"
  | "home"
  | "camera"
  | "stop"
  | "eraser"
  | "palette"
  | "users"
  | "lock-check"
  | "external-link"
  | "asterisk"
  | "menu"
  | "play"
  | "arrow-down"
  | "chevron-down"
  | "scan";

const paths: Record<IconName, string[]> = {
  shield: ["M12 3.2 19 6v6.2c0 4.4-2.9 7.4-7 8.6-4.1-1.2-7-4.2-7-8.6V6l7-2.8Z"],
  "shield-check": [
    "M12 3.2 19 6v6.2c0 4.4-2.9 7.4-7 8.6-4.1-1.2-7-4.2-7-8.6V6l7-2.8Z",
    "m9.2 11.9 2 2 3.7-3.9",
  ],
  lock: ["M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5", "M5.5 10.5h13v9.2h-13z", "M12 14v2.4"],
  cipher: [
    "M9 4H7.2A3.2 3.2 0 0 0 4 7.2V10l-1.6 2L4 14v2.8A3.2 3.2 0 0 0 7.2 20H9",
    "M15 4h1.8A3.2 3.2 0 0 1 20 7.2V10l1.6 2L20 14v2.8A3.2 3.2 0 0 1 16.8 20H15",
    "M10.4 9.6h.01",
    "M13.6 14.4h.01",
  ],
  "mail-warning": [
    "M3.5 6.5h17v12h-17z",
    "m3.7 7.2 8.3 5.9 8.3-5.9",
    "M12 11v3",
    "M12 16.4h.01",
  ],
  blocks: ["M4 4h6.4v6.4H4z", "M13.6 4H20v6.4h-6.4z", "M4 13.6h6.4V20H4z", "M13.6 13.6H20V20h-6.4z"],
  face: [
    "M4 8.4V5.8A1.8 1.8 0 0 1 5.8 4h2.6",
    "M15.6 4h2.6A1.8 1.8 0 0 1 20 5.8v2.6",
    "M20 15.6v2.6a1.8 1.8 0 0 1-1.8 1.8h-2.6",
    "M8.4 20H5.8A1.8 1.8 0 0 1 4 18.2v-2.6",
    "M9.3 10.2h.01",
    "M14.7 10.2h.01",
    "M9 14.2c.8 1.2 1.8 1.8 3 1.8s2.2-.6 3-1.8",
  ],
  "arrow-right": ["M4.5 12h14.5", "M13 5.8 19.2 12 13 18.2"],
  "arrow-up-right": ["M7 17 17 7", "M8.6 7H17v8.4"],
  "chevron-left": ["M14.5 5.5 8 12l6.5 6.5"],
  "chevron-right": ["M9.5 5.5 16 12l-6.5 6.5"],
  check: ["m4.5 12.5 4.8 4.8L19.6 7"],
  "check-circle": ["M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2Z", "m8.3 12.2 2.5 2.5 5-5.1"],
  x: ["M6.2 6.2 17.8 17.8", "M17.8 6.2 6.2 17.8"],
  sparkles: [
    "M12 3.4l1.7 4.5 4.5 1.7-4.5 1.7L12 15.8l-1.7-4.5L5.8 9.6l4.5-1.7L12 3.4Z",
    "M18.4 15.2l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z",
  ],
  eye: ["M2.6 12S6.2 6.2 12 6.2 21.4 12 21.4 12 17.8 17.8 12 17.8 2.6 12 2.6 12Z", "M12 9.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z"],
  "eye-off": [
    "M4 4l16 16",
    "M9.6 6.7A9.6 9.6 0 0 1 12 6.2c5.8 0 9.4 5.8 9.4 5.8a17 17 0 0 1-2.4 3.2",
    "M6.4 8.2A16.4 16.4 0 0 0 2.6 12s3.6 5.8 9.4 5.8c1 0 1.9-.2 2.7-.5",
    "M10.4 10.4a2.4 2.4 0 0 0 3.2 3.2",
  ],
  copy: ["M9.2 9.2h10.6v10.6H9.2z", "M5.2 15.2V4.2h10.6v3.1"],
  refresh: ["M20 11.4a8.2 8.2 0 1 0-2.5 6.3", "M20 4.4v7h-7"],
  clock: ["M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8Z", "M12 7.6V12l3 1.9"],
  lightbulb: [
    "M9.2 18.4h5.6",
    "M10.2 21h3.6",
    "M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.7v.6h5.4v-.6c0-.7.3-1.3.8-1.7A6 6 0 0 0 12 3Z",
  ],
  star: [
    "M12 3.6l2.6 5.3 5.8.9-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.8l5.8-.9L12 3.6Z",
  ],
  home: ["M3.8 10.8 12 4l8.2 6.8V20H3.8z", "M9.6 20v-5h4.8v5"],
  camera: ["M4 8.4h3.2L8.6 6h6.8l1.4 2.4H20v10.8H4z", "M12 10.6a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z"],
  stop: ["M6.4 6.4h11.2v11.2H6.4z"],
  eraser: ["M7.4 20.4 3.6 16.6l8.6-8.6 7.4 7.4-5.8 5.8H7.4Z", "M8.6 20.4h11.8"],
  palette: [
    "M12 3.6a8.4 8.4 0 1 0 0 16.8c1.2 0 1.6-.9 1.6-1.8s.6-1.8 1.9-1.8h1.6a3.3 3.3 0 0 0 3.3-3.3c0-5.5-3.8-9.9-8.4-9.9Z",
    "M8.4 10.4h.01",
    "M11.6 7.8h.01",
    "M15.4 9.4h.01",
  ],
  users: ["M8.6 4.6a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z", "M2.8 20v-1.6a4.8 4.8 0 0 1 4.8-4.8h2a4.8 4.8 0 0 1 4.8 4.8V20", "M16.4 5.2a3 3 0 0 1 0 5.8", "M17.6 13.8a4.6 4.6 0 0 1 3.6 4.5V20"],
  "lock-check": ["M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5", "M5.5 10.5h13v9.2h-13z", "m9.8 15 1.7 1.7 3.2-3.3"],
  "external-link": ["M14 4.2h5.8V10", "M19.8 4.2 11 13", "M18 14.4v5.4H4.2V6h5.4"],
  asterisk: ["M12 4.4v15.2", "M5.2 8.2l13.6 7.6", "M18.8 8.2 5.2 15.8"],
  menu: ["M4 7.5h16", "M4 12h16", "M4 16.5h10"],
  play: ["M8.2 5.4 18.6 12 8.2 18.6Z"],
  "arrow-down": ["M12 4.6v14.2", "M5.8 12.8 12 19l6.2-6.2"],
  "chevron-down": ["M5.5 9.2 12 15.6l6.5-6.4"],
  scan: ["M4 8V5.8A1.8 1.8 0 0 1 5.8 4H8", "M16 4h2.2A1.8 1.8 0 0 1 20 5.8V8", "M20 16v2.2a1.8 1.8 0 0 1-1.8 1.8H16", "M8 20H5.8A1.8 1.8 0 0 1 4 18.2V16", "M4 12h16"],
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  strokeWidth?: number;
};

export function Icon({ name, strokeWidth = 1.9, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export const missionIconNames = {
  lock: "lock",
  cipher: "cipher",
  hook: "mail-warning",
  blocks: "blocks",
  face: "face",
} as const;
