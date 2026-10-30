import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Icon, missionIconNames } from "@/components/icon";
import { MissionArt } from "@/components/mission-art";
import { MissionComplete } from "@/components/mission-complete";
import { SectionEdge } from "@/components/section-edge";
import { getNeighbours, missions, type Mission } from "@/lib/missions";

type Step = { title: string; body: string };

type MissionShellProps = {
  mission: Mission;
  steps: Step[];
  mentorTip?: string;
  children: ReactNode;
};

export function MissionShell({ mission, steps, mentorTip, children }: MissionShellProps) {
  const { previous, next } = getNeighbours(mission.slug);
  const style = { "--accent": mission.accent, "--tint": mission.tint } as CSSProperties;

  return (
    <div style={style}>
      <div className="relative overflow-hidden bg-[var(--tint)]">
        <div
          className="texture-dots pointer-events-none absolute inset-0 text-[var(--accent)] opacity-[0.16]"
          style={{
            maskImage: "radial-gradient(70% 90% at 85% 10%, #000, transparent 72%)",
            WebkitMaskImage: "radial-gradient(70% 90% at 85% 10%, #000, transparent 72%)",
          }}
          aria-hidden="true"
        />
        <span
          className="numeral pointer-events-none absolute -right-2 -top-8 select-none text-[11rem] leading-none text-[var(--accent)] opacity-[0.12] sm:text-[16rem]"
          aria-hidden="true"
        >
          {String(mission.order).padStart(2, "0")}
        </span>

        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-5 sm:px-6 sm:pb-14">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/#missions"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-ink/60 transition-colors hover:text-ink"

            >
              <Icon name="chevron-left" className="size-4" strokeWidth={2.4} />
              All missions
            </Link>
            <div className="flex items-center gap-1.5" aria-label={`Mission ${mission.order} of ${missions.length}`}>
              {missions.map((item) => (
                <span
                  key={item.slug}
                  aria-hidden="true"
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: item.slug === mission.slug ? "1.4rem" : "0.375rem",
                    background:
                      item.slug === mission.slug ? mission.accent : "color-mix(in srgb, var(--color-ink) 18%, transparent)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 grid items-center gap-8 lg:grid-cols-[1fr_18rem] lg:gap-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-14 shrink-0 place-items-center rounded-[1.1rem] bg-paper text-[var(--accent)] shadow-sm ring-1 ring-black/5 sm:size-16">
                  <Icon
                    name={missionIconNames[mission.icon]}
                    className="size-7 sm:size-8"
                    strokeWidth={1.8}
                  />
                </span>
                <div>
                  <p className="font-display text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[var(--accent)]">
                    Mission {String(mission.order).padStart(2, "0")} of {String(missions.length).padStart(2, "0")}
                  </p>
                  <p className="text-xs font-bold text-ink/50">{mission.level}</p>
                </div>
              </div>

              <h1 className="display-xl mt-5 max-w-2xl">{mission.title}</h1>
              <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-ink/70">{mission.description}</p>

              <div className="dot-list mt-4 text-ink/55">
                <span className="inline-flex items-center gap-1">
                  <Icon name="clock" className="size-3.5" /> {mission.minutes}
                </span>
                {mission.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative rotate-2 rounded-[1.3rem] border border-black/5 bg-paper p-2.5 shadow-[0_28px_50px_-30px_rgba(22,20,44,0.55)] transition-transform duration-500 hover:rotate-0">
                <MissionArt
                  slug={mission.icon}
                  accent={mission.accent}
                  tint={mission.tint}
                  className="aspect-[4/3] w-full rounded-[1rem]"
                  slice
                />
                <span className="absolute -left-3 -top-3 grid size-9 place-items-center rounded-full bg-[var(--accent)] text-white shadow-md">
                  <Icon name={missionIconNames[mission.icon]} className="size-4" strokeWidth={2.2} />
                </span>
              </div>
            </div>
          </div>
        </div>

        <SectionEdge variant="tear" color="var(--color-paper)" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6 sm:pt-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-12">
          <div className="min-w-0">{children}</div>

          <aside className="flex flex-col gap-8 lg:sticky lg:top-28">
            <section aria-labelledby="briefing-heading" className="border-t-2 border-[var(--accent)] pt-4">
              <h2 id="briefing-heading" className="flex items-center gap-2 font-display text-base font-bold">
                <Icon name="lightbulb" className="size-4 text-[var(--accent)]" />
                Mission briefing
              </h2>
              <ol className="mt-4 space-y-4">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="round-label shrink-0 text-[var(--accent)]">{index + 1}</span>
                    <span className="min-w-0">
                      <span className="block font-display text-[0.95rem] font-bold leading-snug">
                        {step.title}
                      </span>
                      <span className="mt-0.5 block text-[0.85rem] leading-relaxed text-muted">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section
              aria-labelledby="wrap-heading"
              className="rounded-[1.2rem] border border-[var(--accent)]/20 bg-[var(--tint)] p-5"
            >
              <h2 id="wrap-heading" className="flex items-center gap-2 font-display text-base font-bold">
                <Icon name="shield-check" className="size-4 text-[var(--accent)]" />
                Wrap it up
              </h2>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/75">
                <span className="font-bold text-ink">Say it out loud: </span>
                {mission.takeaway}
              </p>
              <MissionComplete mission={mission} nextHref={next?.href} nextTitle={next?.title} />
            </section>

            {mentorTip ? (
              <section className="relative border-l-2 border-dashed border-ink/25 pl-4">
                <h2 className="flex items-center gap-2 font-display text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-muted">
                  <Icon name="users" className="size-4" />
                  Mentor tip
                </h2>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">{mentorTip}</p>
              </section>
            ) : null}
          </aside>
        </div>

        <nav aria-label="Mission navigation" className="mt-12 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
          {previous ? (
            <Link
              href={previous.href}
              className="group flex items-center gap-3"


            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                <Icon name="chevron-left" className="size-4" strokeWidth={2.4} />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-muted">
                  Previous
                </span>
                <span className="block truncate font-display text-[0.95rem] font-bold leading-tight transition-colors group-hover:text-[var(--accent)]">
                  {previous.title}
                </span>
              </span>
            </Link>
          ) : (
            <Link href="/#missions" className="group flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                <Icon name="home" className="size-4" />
              </span>
              <span>
                <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-muted">
                  Back to
                </span>
                <span className="block font-display text-[0.95rem] font-bold leading-tight">All missions</span>
              </span>
            </Link>
          )}

          {next ? (
            <Link
              href={next.href}
              className="group flex items-center justify-between gap-3 sm:justify-end sm:text-right"


            >
              <span className="min-w-0 sm:order-2">
                <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-muted">
                  Next up
                </span>
                <span className="block truncate font-display text-[0.95rem] font-bold leading-tight">
                  {next.title}
                </span>
              </span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors group-hover:bg-ink group-hover:text-paper sm:order-1">
                <Icon name="chevron-right" className="size-4" strokeWidth={2.4} />
              </span>
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  );
}
