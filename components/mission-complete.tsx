"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import type { Mission } from "@/lib/missions";
import { useBadges } from "@/lib/progress";

export function MissionComplete({
  mission,
  nextHref,
  nextTitle,
}: {
  mission: Mission;
  nextHref?: string;
  nextTitle?: string;
}) {
  const { award, has, ready } = useBadges();
  const completed = ready && has(mission.slug);
  const [justEarned, setJustEarned] = useState(false);

  useEffect(() => {
    if (!justEarned) return;
    const timeout = window.setTimeout(() => setJustEarned(false), 4000);
    return () => window.clearTimeout(timeout);
  }, [justEarned]);

  if (completed) {
    return (
      <div className="mt-4">
        <p className="animate-pop flex items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-2 text-[0.82rem] font-extrabold uppercase tracking-[0.06em] text-white">
          <Icon name="shield-check" className="size-4" />
          Badge earned
          {justEarned ? <span className="ml-auto text-[0.6rem] opacity-80">saved</span> : null}
        </p>
        <Link
          href={nextHref ?? "/#missions"}
          className="btn btn--accent mt-3 w-full"

        >
          {nextHref ? `Next: ${nextTitle}` : "Back to all missions"}
          <Icon name="arrow-right" className="btn__arrow size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        className="btn btn--accent w-full"
        onClick={() => {
          award(mission.slug);
          setJustEarned(true);
        }}

      >
        <Icon name="check" className="size-4" strokeWidth={2.8} />
        I finished this mission
      </button>
      <p className="mt-2 text-center text-[0.7rem] font-semibold leading-snug text-ink/55">
        Saved in this browser only. No account needed.
      </p>
    </div>
  );
}
