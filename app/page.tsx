import Image from "next/image";
import Link from "next/link";
import { HeroOrbit } from "@/components/hero-orbit";
import { Icon, type IconName } from "@/components/icon";
import { Magnetic } from "@/components/magnetic";
import { ProjectGallery } from "@/components/project-gallery";
import { Reveal } from "@/components/reveal";
import { SectionEdge } from "@/components/section-edge";
import { WordBounce } from "@/components/word-bounce";

const rules: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "users",
    title: "Ask first",
    body: "Before you download, install, or sign up for anything, check with a grown-up you trust.",
  },
  {
    icon: "lock",
    title: "Guard your info",
    body: "Your full name, address, school, and phone number are private. They are not for the internet.",
  },
  {
    icon: "shield-check",
    title: "Tell an adult",
    body: "If something online feels weird, scary, or too good to be true, saying something is always the right move.",
  },
];

const steps = [
  {
    title: "Pick a mission",
    body: "Start anywhere. Every mission is a self-contained game built around one clear idea.",
  },
  {
    title: "Try, fail, retry",
    body: "Nothing here can break and nothing gets graded. Wrong answers come with an explanation.",
  },
  {
    title: "Earn the badge",
    body: "Finish a mission and the badge saves in your browser. Collect all five.",
  },
];

const plan = [
  ["5 min", "Warm-up: ask what a password is for."],
  ["20 min", "One mission, together or in pairs."],
  ["10 min", "Phishing Defender as a whole-group quiz."],
  ["10 min", "Share-out: what surprised you?"],
];

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden">
        <div
          className="texture-grid pointer-events-none absolute inset-0 text-ink opacity-[0.055]"
          style={{
            maskImage: "radial-gradient(75% 60% at 70% 30%, #000, transparent 78%)",
            WebkitMaskImage: "radial-gradient(75% 60% at 70% 30%, #000, transparent 78%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6 lg:pb-20 lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.15em] text-muted backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-teal" />
              </span>
              After school · Grades 4-8
            </p>

            <h1 className="display-hero mt-6">
              Learn to{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="quirk text-grape">outsmart</span>
                <svg
                  viewBox="0 0 240 18"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-[0.28em] w-full text-coral"
                >
                  <path
                    d="M3 13c38-9 70 5 108-2s64-9 126 1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br className="hidden sm:block" /> the internet.
            </h1>

            <p className="lede mt-6 max-w-xl">
              Five hands-on missions about passwords, secret codes, scams, and AI. Break things, retry, and
              find out how the internet really works. No sign-up and nothing to install.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Magnetic>
                <Link href="/missions/passwords" className="btn btn--primary btn--lg">
                  Start your first mission
                  <Icon name="arrow-right" className="btn__arrow size-5" />
                </Link>
              </Magnetic>
              <Link href="/#missions" className="btn btn--ghost">
                See all five missions
                <Icon name="arrow-down" className="size-4" />
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold text-muted">
              <li className="inline-flex items-center gap-1.5">
                <Icon name="check-circle" className="size-4 text-teal" /> No accounts
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Icon name="check-circle" className="size-4 text-teal" /> Nothing to install
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Icon name="check-circle" className="size-4 text-teal" /> Works on any device
              </li>
            </ul>
          </div>

          <HeroOrbit />
        </div>
      </section>

      {/* ------------------------------------------------- shaped edge + ticker */}
      <div className="bg-paper">
        <SectionEdge variant="wave" color="var(--color-ink)" />
      </div>
      <WordBounce />
      <div className="bg-ink">
        <SectionEdge variant="tear" color="var(--color-paper)" />
      </div>

      {/* ------------------------------------------------------------- missions */}
      <section id="missions" className="scroll-mt-24 bg-paper">
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-12 sm:px-6 sm:pt-16">
          <Reveal>
            <ProjectGallery />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- rules band */}
      <div className="bg-paper">
        <SectionEdge variant="arch" color="var(--color-ink)" />
      </div>
      <section className="band relative bg-ink text-paper">
        <div
          className="texture-dots pointer-events-none absolute inset-0 text-paper opacity-[0.07]"
          style={{
            maskImage: "radial-gradient(80% 80% at 90% 20%, #000, transparent 72%)",
            WebkitMaskImage: "radial-gradient(80% 80% at 90% 20%, #000, transparent 72%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18">
          <div className="grid gap-9 lg:grid-cols-[0.9fr_1.5fr] lg:items-start lg:gap-16">
            <Reveal>
              <p className="kicker text-lime">Remember these</p>
              <h2 className="display-lg mt-3">Three rules that keep you safe online.</h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/55">
                Every mission comes back to these. They are worth memorising before anything else.
              </p>
            </Reveal>

            <ul className="grid gap-8 sm:grid-cols-3 sm:gap-0">
              {rules.map((rule, index) => (
                <Reveal
                  as="li"
                  key={rule.title}
                  delay={index * 90}
                  className="relative sm:px-6 sm:first:pl-0 sm:last:pr-0"
                >
                  {index > 0 ? (
                    <span className="absolute left-0 top-0 hidden h-full w-px bg-paper/15 sm:block" aria-hidden="true" />
                  ) : null}
                  <span className="flex items-center gap-3">
                    <span className="numeral text-2xl text-paper/35">0{index + 1}</span>
                    <span className="grid size-9 place-items-center rounded-full bg-paper/10 text-lime">
                      <Icon name={rule.icon} className="size-4" />
                    </span>
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold leading-tight text-paper">{rule.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-paper/60">{rule.body}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <div className="bg-ink">
        <SectionEdge variant="wave" color="var(--color-paper)" flip />
      </div>

      {/* ---------------------------------------------------------- how it works */}
      <section id="how" className="scroll-mt-24 bg-paper">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
          <Reveal>
            <div className="max-w-2xl">
              <p className="kicker text-teal">How a session works</p>
              <h2 className="display-xl mt-3">No instructions to read first.</h2>
              <p className="lede mt-4">
                Open a mission and the game explains itself as you play. Most of the teaching happens after a
                wrong guess, when it shows you what you missed.
              </p>
            </div>
          </Reveal>

          <ol className="mt-12 grid gap-9 sm:grid-cols-3 sm:gap-8">
            {steps.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 100}
                className="relative border-t-2 border-ink/12 pt-6"
              >
                <span
                  className="absolute -top-[6px] left-0 size-2.5 rounded-full bg-grape ring-4 ring-paper"
                  aria-hidden="true"
                />
                <span className="numeral block text-4xl text-ink/15 sm:text-5xl">0{index + 1}</span>
                <h3 className="mt-3 font-display text-xl font-bold leading-tight">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <p className="mt-10 flex items-start gap-2 border-t border-line pt-5 text-sm font-semibold text-muted sm:items-center">
              <Icon name="lightbulb" className="mt-px size-4 shrink-0 text-amber" />
              One mission takes about 20 minutes. No accounts and no setup. Open one and start playing.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ grown-ups */}
      <div className="bg-paper">
        <SectionEdge variant="zig" color="var(--color-cream)" />
      </div>
      <section id="grown-ups" className="scroll-mt-24 bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div>
              <Reveal>
                <p className="kicker text-amber">For grown-ups</p>
                <h2 className="display-xl mt-3">A calm, safe way to teach cybersecurity.</h2>
                <p className="lede mt-4 max-w-xl">
                  The playground fits into a 30-45 minute block with a parent or teacher nearby. Everything
                  happens in the browser, so there is nothing to install on a school network.
                </p>
              </Reveal>

              <Reveal delay={80}>
                <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-5">
                  {[
                    ["30-45", "minutes, start to finish"],
                    ["4-8", "grade reading level"],
                    ["0", "accounts or email required"],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <dt className="numeral text-3xl text-amber sm:text-4xl">{value}</dt>
                      <dd className="mt-1 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-muted">
                        {label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <Reveal>
                  <h3 className="font-display text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-muted">
                    What&apos;s inside
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-[0.95rem] text-muted">
                    {[
                      "Five self-paced activities, 10-20 minutes each",
                      "Written for grades 4-8 and tested with students in class",
                      "Every wrong answer gets an explanation",
                      "Works on Chromebooks, iPads, and phones",
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <Icon name="check" className="mt-1 size-4 shrink-0 text-teal" strokeWidth={2.6} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={80}>
                  <h3 className="font-display text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-muted">
                    Your privacy
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-[0.95rem] text-muted">
                    {[
                      "No accounts, logins, or email collection",
                      "No analytics or third-party trackers",
                      "AI Lab video never leaves the device",
                      "Scratch games are embedded from scratch.mit.edu",
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <Icon name="lock" className="mt-1 size-4 shrink-0 text-teal" strokeWidth={2.2} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>

            <Reveal delay={120}>
              <div className="rounded-[1.5rem] bg-paper p-6 ring-1 ring-line sm:p-7">
                <h3 className="font-display text-lg font-bold">Suggested 45-minute plan</h3>
                <ol className="relative mt-5 space-y-5 border-l border-ink/15 pl-6">
                  {plan.map(([time, text], index) => (
                    <li key={`${time}-${index}`} className="relative">
                      <span
                        className="absolute -left-[1.66rem] top-1.5 size-2.5 rounded-full bg-amber ring-4 ring-paper"
                        aria-hidden="true"
                      />
                      <span className="block text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-amber">
                        {time}
                      </span>
                      <span className="mt-0.5 block text-[0.95rem] leading-snug text-muted">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <Image
                  src="/indian-river-crest.png"
                  alt="Indian River Warrior Pride crest"
                  width={76}
                  height={76}
                  className="size-[4.5rem] shrink-0 -rotate-6 rounded-full bg-white object-contain ring-1 ring-line"
                />
                <p className="text-sm leading-snug text-muted">
                  <span className="block font-display font-bold text-ink">Indian River Middle School</span>
                  After school cyber program.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- closing CTA */}
      <div className="bg-cream">
        <SectionEdge variant="arch" color="var(--color-grape)" />
      </div>
      <section className="band relative overflow-hidden bg-grape text-paper">
        <div className="morph-blob pointer-events-none absolute -left-24 top-1/2 size-[24rem] -translate-y-1/2 bg-white/10" aria-hidden="true" />
        <div className="morph-blob pointer-events-none absolute -right-20 bottom-0 size-[20rem] bg-teal/40 blur-2xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <Reveal>
            <p className="kicker justify-center text-paper">Your move</p>
            <h2 className="display-xl mt-3">Your first mission is ready.</h2>
            <p className="mx-auto mt-4 max-w-lg text-[1.02rem] leading-relaxed text-paper/80">
              Start with passwords. Fifteen minutes from now you&apos;ll know exactly why your old password was
              a bad idea.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <Link href="/missions/passwords" className="btn btn--lg bg-paper text-ink hover:bg-white">
                  Password Power-Up
                  <Icon name="arrow-right" className="btn__arrow size-5" />
                </Link>
              </Magnetic>
              <Link
                href="/missions/phishing"
                className="btn btn--lg border border-paper/40 text-paper hover:bg-paper/10"
              >
                Or spot some scams
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
