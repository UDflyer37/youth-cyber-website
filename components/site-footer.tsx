import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { SectionEdge } from "@/components/section-edge";
import { missions } from "@/lib/missions";

export function SiteFooter() {
  return (
    <>
      <div className="bg-paper">
        <SectionEdge variant="scallop" color="var(--color-ink)" />
      </div>
      <footer className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-[0.9rem] bg-paper text-ink">
                  <Icon name="shield" className="size-5" strokeWidth={2} />
                </span>
                <span className="font-display text-lg font-bold tracking-tight">
                  Cyber Adventure Playground
                </span>
              </div>
              <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-paper/65">
                A free after school program from Indian River, built to make cybersecurity feel like a game
                instead of a lecture.
              </p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-paper/20 px-3 py-1.5 text-xs font-bold text-paper/75">
                <Icon name="lock-check" className="size-4 text-lime" />
                No accounts. No tracking. Runs in your browser.
              </p>
            </div>

            <nav aria-label="Missions" className="text-[0.95rem]">
              <h2 className="font-display text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-paper/45">
                Missions
              </h2>
              <ul className="mt-4 space-y-3">
                {missions.map((mission, index) => (
                  <li key={mission.slug}>
                    <Link
                      href={mission.href}
                      className="group flex items-baseline gap-2.5 font-semibold text-paper/80 transition-colors hover:text-paper"
                    >
                      <span className="numeral text-[0.7rem] text-paper/35">0{index + 1}</span>
                      <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-paper/40">
                        {mission.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="text-[0.95rem]">
              <h2 className="font-display text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-paper/45">
                The program
              </h2>
              <ul className="mt-4 space-y-3 text-paper/80">
                <li>
                  <Link href="/#grown-ups" className="font-semibold transition-colors hover:text-paper">
                    For grown-ups
                  </Link>
                </li>
                <li>
                  <Link href="/missions/scratch" className="font-semibold transition-colors hover:text-paper">
                    Project arcade
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/UDflyer37/youth-cyber-website"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 font-semibold transition-colors hover:text-paper"
                  >
                    Source on GitHub
                    <Icon name="external-link" className="size-3.5" />
                  </a>
                </li>
              </ul>

              <div className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-paper/10 p-3 pr-4">
                <Image
                  src="/indian-river-crest.png"
                  alt="Indian River Warrior Pride crest"
                  width={56}
                  height={56}
                  className="size-12 shrink-0 rotate-[-6deg] rounded-full bg-white object-contain"
                />
                <p className="text-[0.62rem] font-extrabold uppercase leading-tight tracking-[0.14em] text-paper/70">
                  Indian River
                  <br /> Warrior Pride
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-paper/15 pt-6 text-xs font-semibold text-paper/50 sm:flex-row sm:items-center sm:justify-between">
            <p>MIT licensed</p>
            <p className="inline-flex items-center gap-1.5">
              Built for curious humans in grades 4-8
              <Icon name="asterisk" className="size-3 text-lime" strokeWidth={2.4} />
            </p>
          </div>
        </div>

        <div className="overflow-hidden px-4 sm:px-6" aria-hidden="true">
          <p className="mx-auto max-w-6xl select-none font-display text-[clamp(2.4rem,11vw,8.5rem)] font-bold leading-[0.75] tracking-[-0.05em] text-paper/[0.07]">
            CYBER PLAYGROUND
          </p>
        </div>
      </footer>
    </>
  );
}
