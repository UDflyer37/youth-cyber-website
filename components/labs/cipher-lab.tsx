"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const STEP = 360 / 26;

function caesar(text: string, shift: number): string {
  const normalized = ((shift % 26) + 26) % 26;
  return text
    .split("")
    .map((character) => {
      const code = character.charCodeAt(0);
      const isUpper = code >= 65 && code <= 90;
      const isLower = code >= 97 && code <= 122;
      if (!isUpper && !isLower) return character;
      const base = isUpper ? 65 : 97;
      return String.fromCharCode(((code - base + normalized) % 26) + base);
    })
    .join("");
}

const challenges = [
  {
    id: "dog",
    cipher: "WKH GRJ LV VOHHSLQJ",
    answer: "THE DOG IS SLEEPING",
    hint: "The most common three-letter word in English is THE. Which shift turns W into T?",
  },
  {
    id: "agents",
    cipher: "ZLJYLA JVKLZ HYL MBU",
    answer: "SECRET CODES ARE FUN",
    hint: "Try shift 7. Decoding means moving the letters backwards.",
  },
  {
    id: "robots",
    cipher: "EBOBGF ARIRE FYRRC",
    answer: "ROBOTS NEVER SLEEP",
    hint: "This one uses shift 13, a special case where encoding and decoding are the same step.",
  },
];

const sampleMessage = "Meet me at the library after school";

export function CipherLab() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [shift, setShift] = useState(3);
  const [message, setMessage] = useState(sampleMessage);
  const [copied, setCopied] = useState(false);

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [guess, setGuess] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [solved, setSolved] = useState<string[]>([]);

  const challenge = challenges[challengeIndex];
  const output = mode === "encode" ? caesar(message, shift) : caesar(message, -shift);
  const decodedGuess = caesar(challenge.cipher, -guess);
  // Only the shift that currently produces real words counts as cracked. Slide
  // away from it and the message scrambles again.
  const isMatch = decodedGuess.trim().toUpperCase() === challenge.answer.toUpperCase();
  const wasSolved = solved.includes(challenge.id);

  // A correct shift is a win even if the student never presses another button.
  useEffect(() => {
    if (!isMatch) return;
    setSolved((current) => (current.includes(challenge.id) ? current : [...current, challenge.id]));
  }, [isMatch, challenge.id]);

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function goToChallenge(index: number) {
    setChallengeIndex(index);
    setGuess(0);
    setRevealed(false);
  }

  function nextChallenge() {
    goToChallenge((challengeIndex + 1) % challenges.length);
  }

  return (
    <div className="flex flex-col gap-10">
      {/* -------------------------------------------------------- cipher machine */}
      <section aria-labelledby="machine-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              id="machine-heading"
              className="font-display text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[var(--accent)]"
            >
              Cipher machine
            </h2>
            <p className="mt-1 text-sm text-muted">Move the key. Every letter slides the same distance.</p>
          </div>
          <div
            className="inline-flex rounded-full border border-line bg-cream/70 p-1"
            role="group"
            aria-label="Cipher direction"
          >
            {(["encode", "decode"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                aria-pressed={mode === option}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                  mode === option ? "bg-paper text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {option === "encode" ? "Scramble" : "Unscramble"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
          <div className="min-w-0">
            <label htmlFor="cipher-input" className="label">
              {mode === "encode" ? "Your secret message" : "A message to crack"}
            </label>
            <textarea
              id="cipher-input"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={3}
              className="field resize-y text-[1rem]"
              placeholder="Type a message…"
              spellCheck={false}
            />

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label htmlFor="shift" className="label mb-0">
                  Shift key
                </label>
                <span className="rounded-full bg-[var(--tint)] px-2.5 py-1 font-mono text-sm font-bold text-[var(--accent)]">
                  +{shift}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShift((current) => (current === 1 ? 25 : current - 1))}
                  className="icon-btn shrink-0"
                  aria-label="Decrease shift by one"
                >
                  <Icon name="chevron-left" className="size-4" strokeWidth={2.4} />
                </button>
                <input
                  id="shift"
                  type="range"
                  min={1}
                  max={25}
                  value={shift}
                  onChange={(event) => setShift(Number(event.target.value))}
                  className="range"
                  style={{
                    background: `linear-gradient(to right, var(--accent) ${((shift - 1) / 24) * 100}%, var(--color-cream) ${((shift - 1) / 24) * 100}%)`,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShift((current) => (current === 25 ? 1 : current + 1))}
                  className="icon-btn shrink-0"
                  aria-label="Increase shift by one"
                >
                  <Icon name="chevron-right" className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-muted">
                  {mode === "encode" ? "Ciphertext" : "Plaintext"}
                </span>
                <button
                  type="button"
                  onClick={copyOutput}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-muted transition-colors hover:bg-cream hover:text-ink"
                >
                  <Icon name={copied ? "check" : "copy"} className="size-3.5" strokeWidth={2.4} />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <output
                aria-live="polite"
                className="block min-h-[4.5rem] w-full break-words rounded-xl bg-ink p-4 font-mono text-lg font-bold leading-relaxed tracking-wide text-lime"
              >
                {output || "Nothing yet"}
              </output>
              <p className="mt-2 text-xs font-semibold text-muted">
                Nobody can read this without knowing the shift number. That number is the key.
              </p>
            </div>
          </div>

          <figure className="rounded-[1.3rem] border border-line bg-paper p-3">
            <svg
              viewBox="0 0 300 300"
              className="wheel"
              role="img"
              aria-label={`Cipher wheel. Each letter maps ${shift} places around the alphabet.`}
            >
              <circle cx="150" cy="150" r="146" fill="#fffdf9" stroke="var(--color-line)" strokeWidth="1.5" />
              {ALPHABET.split("").map((letter, index) => (
                <line
                  key={`tick-${letter}`}
                  x1="150"
                  y1="6"
                  x2="150"
                  y2={index % 5 === 0 ? 16 : 12}
                  stroke="var(--color-ink)"
                  strokeWidth="1.4"
                  opacity="0.22"
                  transform={`rotate(${index * STEP} 150 150)`}
                />
              ))}
              {ALPHABET.split("").map((letter, index) => (
                <text
                  key={`outer-${letter}`}
                  x="150"
                  y="44"
                  textAnchor="middle"
                  className="wheel__letter"
                  transform={`rotate(${index * STEP} 150 150)`}
                >
                  {letter}
                </text>
              ))}

              <g
                className="wheel__inner"
                style={{ transform: `rotate(${-shift * STEP}deg)` }}
              >
                <circle cx="150" cy="150" r="94" fill="var(--accent)" />
                {ALPHABET.split("").map((letter, index) => (
                  <text
                    key={`inner-${letter}`}
                    x="150"
                    y="76"
                    textAnchor="middle"
                    className="wheel__letter wheel__letter--inner"
                    transform={`rotate(${index * STEP} 150 150)`}
                  >
                    {letter}
                  </text>
                ))}
              </g>

              <circle cx="150" cy="150" r="54" fill="var(--color-paper)" stroke="var(--accent)" strokeWidth="2" />
              <text x="150" y="152" textAnchor="middle" className="wheel__hub">
                {shift}
              </text>
              <text x="150" y="170" textAnchor="middle" className="wheel__hub-label">
                SHIFT
              </text>
              <path d="M150 2l7 11h-14z" fill="var(--accent)" />
            </svg>
            <figcaption className="mt-1 px-2 pb-1 text-center text-[0.7rem] font-semibold leading-snug text-muted">
              Outer ring: normal alphabet. Inner ring: scrambled alphabet.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------------------------------------------- cracker playground */}
      <section aria-labelledby="cracker-heading" className="border-t border-line pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="cracker-heading" className="display-lg">
              Cracker&apos;s playground
            </h2>
            <p className="mt-1 text-sm text-muted">Slide the shift until real words appear.</p>
          </div>
          <div className="flex items-center gap-1.5">
            {challenges.map((item, index) => {
              const done = solved.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToChallenge(index)}
                  aria-label={`Secret message ${index + 1}${done ? " (cracked)" : ""}`}
                  aria-pressed={index === challengeIndex}
                  className={`grid size-9 place-items-center rounded-full border text-sm font-bold transition-colors ${
                    index === challengeIndex
                      ? "border-transparent bg-ink text-paper"
                      : done
                        ? "border-teal/40 bg-teal/10 text-teal"
                        : "border-line bg-paper text-muted hover:text-ink"
                  }`}
                >
                  {done ? <Icon name="check" className="size-4" strokeWidth={3} /> : index + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-[1.2rem] bg-ink p-6 text-center sm:p-8">
          <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-paper/45">
            Intercepted message {challengeIndex + 1} of {challenges.length}
          </p>
          <p className="mt-3 break-words font-mono text-xl font-bold tracking-[0.14em] text-paper sm:text-2xl">
            {challenge.cipher}
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <label htmlFor="guess" className="label mb-0">
              Your guess {isMatch ? "(cracked!)" : ""}
            </label>
            <span className="numeral text-xl text-[var(--accent)]">shift {guess}</span>
          </div>

          <p
            aria-live="polite"
            className={`mt-2 min-h-[3rem] break-words rounded-xl border-2 px-4 py-2.5 font-mono text-lg font-bold transition-colors ${
              isMatch ? "border-teal/40 bg-teal/10 text-teal" : "border-line bg-cream/40 text-ink/80"
            }`}
          >
            {decodedGuess || "Nothing yet"}
          </p>

          <div className="mt-3 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setGuess((current) => (current === 0 ? 25 : current - 1))}
              className="icon-btn shrink-0"
              aria-label="Decrease guess by one"
            >
              <Icon name="chevron-left" className="size-4" strokeWidth={2.4} />
            </button>
            <input
              id="guess"
              type="range"
              min={0}
              max={25}
              value={guess}
              onChange={(event) => setGuess(Number(event.target.value))}
              className="range"
              style={{
                background: `linear-gradient(to right, var(--accent) ${(guess / 25) * 100}%, var(--color-cream) ${(guess / 25) * 100}%)`,
              }}
            />
            <button
              type="button"
              onClick={() => setGuess((current) => (current === 25 ? 0 : current + 1))}
              className="icon-btn shrink-0"
              aria-label="Increase guess by one"
            >
              <Icon name="chevron-right" className="size-4" strokeWidth={2.4} />
            </button>
          </div>

          {wasSolved && !isMatch ? (
            <p className="mt-2 text-xs font-semibold text-muted">
              You cracked this one earlier. This shift scrambles it again.
            </p>
          ) : null}

          {isMatch ? (
            <div className="animate-pop mt-4 border-l-2 border-teal bg-teal/10 px-4 py-3">
              <p className="flex items-center gap-2 font-display font-bold text-teal">
                <Icon name="check-circle" className="size-5" />
                Cracked it. The message was &ldquo;{challenge.answer}&rdquo;.
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                You only had 25 shifts to try, so you could brute-force this by hand. A computer tries all 25
                in less than a blink, which is why real encryption needs much bigger keys.
              </p>
              <button type="button" className="btn btn--accent btn--sm mt-3" onClick={nextChallenge}>
                Next message
                <Icon name="arrow-right" className="size-4" />
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => setRevealed((current) => !current)}
                aria-expanded={revealed}
              >
                <Icon name="lightbulb" className="size-4 text-amber" />
                {revealed ? "Hide hint" : "I need a hint"}
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setGuess(0)}>
                Reset guess
              </button>
            </div>
          )}

          {revealed && !isMatch ? (
            <p className="animate-pop mt-3 border-l-2 border-amber bg-amber/10 px-4 py-3 text-sm leading-relaxed text-ink/80">
              <span className="font-bold">Hint: </span>
              {challenge.hint}
            </p>
          ) : null}
        </div>
      </section>

      {/* ------------------------------------------------------------------ why */}
      <section className="border-t border-line pt-8">
        <h2 className="display-lg">Why 25 keys is not enough</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-[1.2fr_0.8fr] sm:items-start">
          <p className="text-[0.98rem] leading-relaxed text-muted">
            This is a Caesar cipher, roughly 2,000 years old. Julius Caesar used a shift of three to hide
            military messages. Clever for its time, but today it is a toy. A real encryption key is hundreds
            of digits long, so trying every possibility would take longer than the universe has existed.
          </p>
          <div className="rounded-xl border border-line bg-cream/50 p-4">
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-muted">
              Keys to try
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="numeral text-4xl text-grape">25</span>
              <span className="pb-1 text-sm font-bold text-muted">for this cipher</span>
            </div>
            <div className="mt-2 flex items-end gap-2 border-t border-line pt-2">
              <span className="numeral text-2xl text-coral">10⁷⁷</span>
              <span className="pb-0.5 text-sm font-bold text-muted">for a modern key</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
