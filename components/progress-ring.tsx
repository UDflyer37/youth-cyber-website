"use client";

import { Icon } from "@/components/icon";
import { missions, TOTAL_MISSIONS } from "@/lib/missions";
import { useBadges } from "@/lib/progress";

export function ProgressRing() {
  const { badges, ready, clear } = useBadges();
  const earned = ready ? missions.filter((mission) => badges.includes(mission.slug)).length : 0;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (earned / TOTAL_MISSIONS) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative grid size-[4.25rem] shrink-0 place-items-center">
        <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--color-cream)" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
          <defs>
            <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5b3df5" />
              <stop offset="55%" stopColor="#e93f5c" />
              <stop offset="100%" stopColor="#059e86" />
            </linearGradient>
          </defs>
        </svg>
        <span className="font-display text-lg font-bold tabular-nums leading-none">
          {ready ? earned : "·"}
          <span className="text-xs text-muted">/{TOTAL_MISSIONS}</span>
        </span>
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 font-display text-sm font-bold">
          <Icon name="star" className="size-4 text-amber" />
          Your badge wallet
        </p>
        <p className="mt-0.5 text-xs font-semibold text-muted" aria-live="polite">
          {!ready
            ? "Saved in this browser"
            : earned === 0
              ? "No badges yet. Pick any mission"
              : earned === TOTAL_MISSIONS
                ? "Complete set. Certified cyber hero."
                : `${TOTAL_MISSIONS - earned} mission${TOTAL_MISSIONS - earned === 1 ? "" : "s"} to go`}
        </p>
        {ready && earned > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted/70 underline underline-offset-2 hover:text-ink"
          >
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}
