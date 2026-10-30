"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

type Project = {
  id: string;
  title: string;
  genre: string;
  blurb: string;
  accent: string;
  tint: string;
  variant: 0 | 1 | 2;
};

const projects: Project[] = [
  {
    id: "793953099",
    title: "Squawky Bird",
    genre: "Score chase · flap & dodge",
    blurb:
      "A one-button flying game: press space to flap, dodge the buildings, and chase a high score. Look for the forever block. That loop is what keeps the game alive.",
    accent: "#d9820b",
    tint: "#ffefd4",
    variant: 0,
  },
  {
    id: "1067637800",
    title: "Stickman Run",
    genre: "Adventure run",
    blurb:
      "A side-scrolling runner with checkpoints and power-ups. Every checkpoint is a variable remembering where you got to. That is the same trick a password checker uses to remember what you typed.",
    accent: "#5b3df5",
    tint: "#eee9ff",
    variant: 1,
  },
  {
    id: "845220709",
    title: "Bouncing My Way Up",
    genre: "Climb & explore",
    blurb:
      "A climbing challenge: launch yourself from platform to platform until you reach the very top. Open it in Scratch and find the block that decides how high each bounce goes.",
    accent: "#059e86",
    tint: "#ddf5ef",
    variant: 2,
  },
];

function ProjectThumb({ project }: { project: Project }) {
  return (
    <svg viewBox="0 0 320 240" className="size-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="240" fill={project.tint} />
      <defs>
        <pattern id={`grid-${project.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0v20" fill="none" stroke={project.accent} strokeWidth="0.7" opacity="0.18" />
        </pattern>
      </defs>
      <rect width="320" height="240" fill={`url(#grid-${project.id})`} />
      <rect x="34" y="30" width="252" height="180" rx="16" fill="#fffdf9" stroke={project.accent} strokeWidth="2.5" />

      {project.variant === 0 ? (
        <>
          <rect x="58" y="150" width="46" height="34" rx="7" fill={project.accent} opacity="0.85" />
          <rect x="114" y="120" width="46" height="64" rx="7" fill={project.accent} opacity="0.45" />
          <rect x="170" y="88" width="46" height="96" rx="7" fill={project.accent} opacity="0.25" />
          <circle cx="248" cy="74" r="16" fill={project.accent} />
          <path d="M243 68l12 6-12 6z" fill="#fffdf9" />
        </>
      ) : project.variant === 1 ? (
        <>
          <path d="M74 160c30 0 30-44 62-44s30 44 60 44" fill="none" stroke={project.accent} strokeWidth="4" strokeLinecap="round" strokeDasharray="7 7" />
          <path d="M74 160c30 0 30 44 62 44s30-44 60-44" fill="none" stroke={project.accent} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          <circle cx="74" cy="160" r="9" fill={project.accent} />
          <circle cx="196" cy="116" r="9" fill={project.accent} />
          <circle cx="196" cy="204" r="9" fill={project.accent} opacity="0.5" />
          <rect x="220" y="150" width="42" height="26" rx="6" fill={project.accent} opacity="0.25" />
        </>
      ) : (
        <>
          {[0, 1, 2, 3].map((bar) => (
            <rect
              key={bar}
              x={62 + bar * 44}
              y={186 - [46, 74, 100, 128][bar]}
              width="28"
              height={[46, 74, 100, 128][bar]}
              rx="6"
              fill={project.accent}
              opacity={0.25 + bar * 0.22}
            />
          ))}
          <path d="M238 60l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2 5-10z" fill={project.accent} />
        </>
      )}

      <g transform="translate(160 120)">
        <circle r="34" fill="#16142c" opacity="0.9" />
        <path d="M-8 -13l24 13-24 13z" fill="#fcf8f0" />
      </g>
    </svg>
  );
}

export function ScratchShowcase() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const [playing, setPlaying] = useState(false);
  const active = projects.find((project) => project.id === activeId) ?? projects[0];

  function select(id: string) {
    setActiveId(id);
    setPlaying(false);
  }

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="arcade-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="arcade-heading"
              className="font-display text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[var(--accent)]"
            >
              Student arcade
            </h2>
            <p className="mt-1 text-sm text-muted">Real projects, running live, made by students like you.</p>
          </div>
          <span className="tag">
            <Icon name="external-link" className="size-3.5" /> Hosted on scratch.mit.edu
          </span>
        </div>

        <div className="mail-window mt-4">
          <div className="mail-chrome">
            <span className="chrome-dot" />
            <span className="chrome-dot" />
            <span className="chrome-dot" />
            <p className="ml-2 min-w-0 flex-1 truncate font-mono text-[0.68rem] text-ink/50">
              scratch.mit.edu/projects/{active.id}
            </p>
            {playing ? (
              <button
                type="button"
                onClick={() => setPlaying(false)}
                className="shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-bold text-ink/60 transition-colors hover:bg-white/60 hover:text-ink"
              >
                Close
              </button>
            ) : null}
          </div>

          <div className="relative aspect-[4/3] w-full bg-ink">
            {playing ? (
              <iframe
                key={active.id}
                src={`https://scratch.mit.edu/projects/${active.id}/embed`}
                title={`${active.title}, a student Scratch project`}
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 size-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 block text-left"
                aria-label={`Load ${active.title} in the player`}


              >
                <ProjectThumb project={active} />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-ink/85 px-4 py-3 text-paper">
                  <span>
                    <span className="block font-display text-sm font-bold">{active.title}</span>
                    <span className="block text-[0.68rem] text-paper/60">{active.genre}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-ink transition-transform group-hover:scale-105">
                    <Icon name="play" className="size-3.5" />
                    Load
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-3" role="tablist" aria-label="Student projects">
          {projects.map((project) => {
            const selected = project.id === activeId;
            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => select(project.id)}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  selected
                    ? "border-transparent bg-ink text-paper"
                    : "border-line bg-paper text-ink hover:bg-cream/60"
                }`}
              >
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-lg"
                  style={{
                    background: selected ? "rgba(252,248,240,0.14)" : project.tint,
                    color: selected ? "#b7e64b" : project.accent,
                  }}
                >
                  <Icon name={project.variant === 1 ? "cipher" : project.variant === 2 ? "star" : "blocks"} className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-[0.88rem] font-bold">{project.title}</span>
                  <span className={`block truncate text-[0.68rem] ${selected ? "text-paper/55" : "text-muted"}`}>
                    {project.genre}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 border-l-2 border-[var(--accent)] pl-3 text-[0.92rem] leading-relaxed text-muted">
          <span className="font-bold text-ink">What to notice: </span>
          {active.blurb}
        </p>

        <a
          href={`https://scratch.mit.edu/projects/${active.id}`}
          target="_blank"
          rel="noreferrer noopener"
          className="btn btn--outline btn--sm mt-4"
        >
          <Icon name="external-link" className="size-4" />
          See the code in Scratch
        </a>
      </section>

      <section aria-labelledby="build-heading" className="border-t border-line pt-8">
        <h2 id="build-heading" className="display-lg">
          Build the next one
        </h2>
        <p className="mt-2 max-w-xl text-[0.97rem] leading-relaxed text-muted">
          Every project in this arcade started as somebody&apos;s first messy attempt. Here is a short path
          from blank screen to something you can show off.
        </p>

        <ol className="mt-6 grid gap-5 sm:grid-cols-2">
          {[
            "Open scratch.mit.edu and start blank, or remix a project you already like.",
            "Pick one cyber idea: a password strength bar, a scam-spotting quiz, or a cipher decoder.",
            "Add movement, sound, and a score so it feels like a game instead of a form.",
            "Bring it to the program and we'll feature it here for everyone to play.",
          ].map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="numeral shrink-0 text-2xl text-amber">0{index + 1}</span>
              <span className="text-[0.94rem] leading-relaxed text-muted">{step}</span>
            </li>
          ))}
        </ol>

        <a
          href="https://scratch.mit.edu"
          target="_blank"
          rel="noreferrer noopener"
          className="btn btn--accent mt-6"


        >
          <Icon name="blocks" className="size-5" />
          Start building
          <Icon name="external-link" className="size-4" />
        </a>
      </section>
    </div>
  );
}
