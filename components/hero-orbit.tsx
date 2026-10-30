"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Icon, missionIconNames } from "@/components/icon";
import { missions } from "@/lib/missions";

const POSITIONS = [
  { left: "50%", top: "0%" },
  { left: "93%", top: "34%" },
  { left: "80%", top: "91%" },
  { left: "20%", top: "91%" },
  { left: "7%", top: "34%" },
];

/**
 * The hero poster: a morphing blob, five orbiting mission medallions, and a
 * centre card that previews whichever mission the student points at.
 */
export function HeroOrbit() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<string | null>(null);

  const activeMission = missions.find((mission) => mission.slug === active);

  function parallax(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = layerRef.current;
    if (!layer) return;
    const rect = layer.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
    layer.style.transform = `translate3d(${(x * 14).toFixed(2)}px, ${(y * 14).toFixed(2)}px, 0)`;
  }

  function reset() {
    setActive(null);
    if (layerRef.current) layerRef.current.style.transform = "";
  }

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[26rem] lg:max-w-[30rem]"
      onPointerMove={parallax}
      onPointerLeave={reset}
    >
      <div
        ref={layerRef}
        className="absolute inset-0"
        style={{ transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <div className="absolute inset-[14%] animate-pulse-soft rounded-full bg-gradient-to-br from-grape/35 via-coral/20 to-teal/35 blur-3xl" />

        <div className="animate-spin-slow absolute inset-[6%] rounded-full border border-dashed border-ink/20" />
        <div className="absolute inset-[17%] rounded-full border border-ink/10" />

        <span className="absolute left-[30%] top-[16%] size-2 rounded-full bg-lime ring-4 ring-lime/20" />
        <span className="absolute right-[24%] bottom-[20%] size-2 rounded-full bg-coral ring-4 ring-coral/15" />

        <div className="absolute left-1/2 top-1/2 w-[52%] -translate-x-1/2 -translate-y-1/2">
          <Link
            href={activeMission?.href ?? "/#missions"}
            className="group block text-center"


          >
            <span className="morph-blob relative block bg-ink px-4 py-[14%] text-paper shadow-[0_36px_60px_-30px_rgba(22,20,44,0.9)]">
              <span className="mx-auto grid size-11 place-items-center rounded-full bg-paper/10">
                <Icon
                  name={activeMission ? missionIconNames[activeMission.icon] : "shield"}
                  className="size-6"
                  strokeWidth={1.8}
                />
              </span>
              <span className="mt-3 block font-display text-[0.98rem] font-bold leading-tight tracking-tight">
                {activeMission ? activeMission.shortTitle : "Cyber Hero"}
              </span>
              <span className="mt-1 block text-[0.55rem] font-extrabold uppercase tracking-[0.2em] text-paper/55">
                {activeMission ? activeMission.minutes : "Collect all five"}
              </span>
              <span className="mt-3 flex justify-center gap-1" aria-hidden="true">
                {missions.map((mission) => (
                  <span
                    key={mission.slug}
                    className="size-1.5 rounded-full transition-colors"
                    style={{
                      background:
                        activeMission?.slug === mission.slug ? mission.accent : "rgba(252,248,240,0.3)",
                    }}
                  />
                ))}
              </span>
            </span>
          </Link>
        </div>

        {missions.map((mission, index) => {
          const position = POSITIONS[index];
          return (
            <Link
              key={mission.slug}
              href={mission.href}
              onPointerEnter={() => setActive(mission.slug)}
              onFocus={() => setActive(mission.slug)}
              onBlur={() => setActive(null)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: position.left, top: position.top }}


              aria-label={`${mission.title}, ${mission.minutes}`}
            >
              <span
                className="animate-float grid size-12 place-items-center rounded-2xl bg-paper shadow-[0_14px_24px_-14px_rgba(22,20,44,0.55)] ring-1 ring-line transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-6deg] sm:size-14"
                style={{ animationDelay: `${index * 0.9}s`, color: mission.accent }}
              >
                <span
                  className="grid size-8 place-items-center rounded-xl sm:size-9"
                  style={{ background: mission.tint }}
                >
                  <Icon name={missionIconNames[mission.icon]} className="size-4 sm:size-5" strokeWidth={2} />
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <span className="absolute -right-1 top-[8%] rotate-6 rounded-full bg-lime px-3 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-ink shadow-sm sm:-right-3">
        5 badges to collect
      </span>
    </div>
  );
}
