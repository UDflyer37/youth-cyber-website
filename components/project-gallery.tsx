"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { Icon } from "@/components/icon";
import { MissionArt } from "@/components/mission-art";
import { ProgressRing } from "@/components/progress-ring";
import { missions } from "@/lib/missions";
import { useBadges } from "@/lib/progress";

/**
 * A drag-scrollable project gallery. Mouse users can fling the strip, touch
 * users get native scrolling, and the arrow buttons keep it keyboard friendly.
 */
export function ProjectGallery() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  const [progress, setProgress] = useState(0);
  const { has, ready } = useBadges();

  function scrollByAmount(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * Math.min(scroller.clientWidth * 0.8, 420), behavior: "smooth" });
  }

  function updateProgress() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    setProgress(max > 0 ? scroller.scrollLeft / max : 0);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    drag.current = {
      down: true,
      startX: event.clientX,
      startScroll: scroller.scrollLeft,
      moved: false,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.down) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const distance = event.clientX - drag.current.startX;
    if (Math.abs(distance) > 6) drag.current.moved = true;
    scroller.scrollLeft = drag.current.startScroll - distance;
  }

  function endDrag() {
    drag.current.down = false;
    // The click that ends a drag fires before this timer, so the guard below
    // still cancels it. A later, intentional click is not swallowed.
    window.setTimeout(() => {
      drag.current.moved = false;
    }, 0);
  }

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="kicker text-coral">The arcade</p>
          <h2 className="display-xl mt-3">Pick a world, peek inside.</h2>
          <p className="lede mt-4">
            Five missions, each with its own look, its own rules, and its own kind of messing about. Slide
            through and see which one you want to open first.
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4 sm:justify-end sm:gap-6 lg:border-0 lg:pt-0">
          <ProgressRing />
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByAmount(-1)}
              className="icon-btn"
              aria-label="Scroll gallery left"
            >
              <Icon name="chevron-left" className="size-4" strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              className="icon-btn"
              aria-label="Scroll gallery right"
            >
              <Icon name="chevron-right" className="size-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        role="region"
        aria-label="Mission preview gallery, scroll or drag sideways"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onScroll={updateProgress}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="no-scrollbar -mx-4 mt-8 flex snap-x snap-proximity gap-5 overflow-x-auto px-4 pb-4 pt-1 sm:-mx-6 sm:px-6"
      >
        {missions.map((mission) => {
          const done = ready && has(mission.slug);
          return (
            <Link
              key={mission.slug}
              href={mission.href}
              className="group flex w-[78%] shrink-0 snap-start flex-col sm:w-[19rem]"
              style={{ "--accent": mission.accent, "--tint": mission.tint } as CSSProperties}
              draggable={false}
            >
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] ring-1 ring-line"
                style={{ background: mission.tint }}
              >
                <MissionArt
                  slug={mission.icon}
                  accent={mission.accent}
                  tint={mission.tint}
                  slice
                  className="absolute inset-0 size-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <span className="numeral absolute left-4 top-3 text-4xl text-[var(--accent)] opacity-40">
                  {String(mission.order).padStart(2, "0")}
                </span>
                {done ? (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-[var(--accent)]">
                    <Icon name="check" className="size-3" strokeWidth={3} /> Earned
                  </span>
                ) : null}

                <div className="absolute inset-x-0 bottom-0 translate-y-[calc(100%-0.25rem)] bg-ink/90 p-4 text-paper transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
                  <p className="text-xs leading-relaxed text-paper/75">{mission.tagline}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 font-display text-sm font-bold text-lime">
                    Open mission
                    <Icon name="arrow-right" className="size-4" strokeWidth={2.4} />
                  </span>
                </div>
              </div>
              <h3 className="mt-3.5 font-display text-[1.15rem] font-bold leading-tight tracking-[-0.02em]">
                {mission.title}
              </h3>
              <p className="dot-list mt-1.5">
                <span>{mission.minutes}</span>
                <span>{mission.level}</span>
              </p>
            </Link>
          );
        })}

        <Link
          href="/missions/scratch"
          className="group flex w-[78%] shrink-0 snap-start flex-col sm:w-[19rem]"
        >
          <div className="grid aspect-[4/5] place-items-center rounded-[1.4rem] border-2 border-dashed border-line bg-paper/60 p-6 text-center transition-colors group-hover:border-amber/60 group-hover:bg-amber-soft/40">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-soft text-amber transition-transform duration-300 group-hover:rotate-90">
                <Icon name="asterisk" className="size-7" strokeWidth={2} />
              </span>
              <p className="mt-4 font-display text-xl font-bold leading-tight">Your build goes here</p>
              <p className="mt-1.5 text-sm text-muted">
                Make something in Scratch and we&apos;ll feature it in the arcade.
              </p>
            </div>
          </div>
          <h3 className="mt-3.5 font-display text-[1.15rem] font-bold leading-tight">Student projects</h3>
          <p className="dot-list mt-1.5">
            <span>Open ended</span>
            <span>All levels</span>
          </p>
        </Link>
      </div>

      <div className="mt-1 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-cream">
          <div
            className="h-full rounded-full bg-ink transition-[width] duration-150"
            style={{ width: `${Math.max(18, progress * 100)}%` }}
          />
        </div>
        <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-muted/70">
          Drag to explore
        </span>
      </div>
    </div>
  );
}
