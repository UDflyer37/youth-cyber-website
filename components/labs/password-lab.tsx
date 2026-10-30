"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";

const COMMON_PASSWORDS = new Set([
  "password", "password1", "passw0rd", "123456", "1234567", "12345678", "123456789", "12345",
  "111111", "000000", "qwerty", "qwerty123", "abc123", "letmein", "welcome", "admin", "iloveyou",
  "monkey", "dragon", "football", "baseball", "princess", "sunshine", "master", "shadow", "superman",
  "michael", "trustno1", "login", "hello", "freedom", "whatever", "starwars", "minecraft", "fortnite",
]);

// Stems catch the obvious stuff: Password123!, ILoveYou2020, qwerty!2024.
const COMMON_STEMS = [
  "password", "passw0rd", "qwerty", "letmein", "iloveyou", "welcome", "admin", "monkey",
  "dragon", "football", "baseball", "princess", "sunshine", "master", "shadow", "superman",
  "trustno", "login", "hello", "freedom", "whatever", "starwars", "minecraft", "fortnite",
];

function looksCommon(password: string) {
  const lower = password.toLowerCase();
  if (COMMON_PASSWORDS.has(lower)) return true;
  const letters = lower.replace(/[^a-z]/g, "");
  return letters.length >= 3 && COMMON_STEMS.some((stem) => letters.includes(stem));
}

const ADJECTIVES = [
  "Brave", "Sunny", "Turbo", "Cosmic", "Quiet", "Zippy", "Clever", "Golden", "Sneaky", "Happy",
  "Wild", "Neon",
];

const ANIMALS = [
  "Otter", "Falcon", "Panda", "Gecko", "Tiger", "Comet", "Koala", "Raccoon", "Dolphin", "Firefly",
  "Lynx", "Wombat",
];

type Rule = {
  id: string;
  label: string;
  ok: boolean;
  hint: string;
};

type Analysis = {
  rules: Rule[];
  passed: number;
  tier: number;
  scored: boolean;
  crackTime: string;
  logSeconds: number;
};

const MAX_LOG_SECONDS = 17;

function estimateCrackTime(password: string, common: boolean, patterned: boolean) {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 33;
  if (pool === 0) return { label: "instantly", entropy: 0, logSeconds: 0 };

  // Raw character maths overrates dictionary words and patterns, so take the
  // credit away when the password is one a wordlist would already contain.
  const raw = password.length * Math.log2(pool);
  const entropy = Math.min(Math.max(4, raw - (common ? 30 : 0) - (patterned ? 14 : 0)), 1024);
  const guesses = Math.pow(2, entropy) / 2;
  // A modern cracking rig tries roughly 10 billion guesses per second.
  const seconds = guesses / 1e10;
  const logSeconds = Math.log10(Math.max(seconds, 0.01));

  if (!Number.isFinite(seconds) || seconds < 1) return { label: "instantly", entropy, logSeconds: 0 };
  if (seconds < 60) return { label: `${Math.round(seconds)} seconds`, entropy, logSeconds };
  if (seconds < 3600) return { label: `${Math.round(seconds / 60)} minutes`, entropy, logSeconds };
  if (seconds < 86400) return { label: `${Math.round(seconds / 3600)} hours`, entropy, logSeconds };
  if (seconds < 31_557_600) return { label: `${Math.round(seconds / 86400)} days`, entropy, logSeconds };

  const years = seconds / 31_557_600;
  if (years < 1_000) return { label: `${Math.round(years)} years`, entropy, logSeconds };
  if (years < 1_000_000) return { label: `${Math.round(years / 1_000)} thousand years`, entropy, logSeconds };
  if (years < 1_000_000_000) return { label: `${Math.round(years / 1_000_000)} million years`, entropy, logSeconds };
  return { label: "longer than the universe has existed", entropy, logSeconds };
}

function analyse(password: string): Analysis {
  const hasRepeat = /(.)\1{2,}/.test(password);
  const hasSequence = /(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer|asdf|zxcv)/i.test(password);
  const common = password.length > 0 && looksCommon(password);
  const patterned = password.length > 0 && (hasRepeat || hasSequence);

  const rules: Rule[] = [
    {
      id: "length",
      label: "12 or more characters",
      ok: password.length >= 12,
      hint: "Length matters more than anything else. Every extra character multiplies the work.",
    },
    {
      id: "upper",
      label: "Uppercase letter",
      ok: /[A-Z]/.test(password),
      hint: "A capital letter widens the alphabet a guesser has to search.",
    },
    {
      id: "lower",
      label: "Lowercase letter",
      ok: /[a-z]/.test(password),
      hint: "Plain lowercase letters count. You don't need a symbol in every spot.",
    },
    {
      id: "number",
      label: "A number",
      ok: /[0-9]/.test(password),
      hint: "A digit adds ten more options for every character position.",
    },
    {
      id: "symbol",
      label: "A symbol",
      ok: /[^a-zA-Z0-9]/.test(password),
      hint: "Symbols like ! ? # or - add roughly 33 more options per character.",
    },
    {
      id: "common",
      label: "Not on the common-password list",
      ok: password.length > 0 && !common,
      hint: "Hackers try the most popular words first: password, qwerty, iloveyou. This one is on those lists.",
    },
    {
      id: "pattern",
      label: "No easy patterns",
      ok: password.length > 0 && !patterned,
      hint: "Patterns like aaa or 1234 are guessed early, even when the password is long.",
    },
  ];

  const passed = rules.filter((rule) => rule.ok).length;
  const ratio = passed / rules.length;
  let tier = ratio === 1 ? 4 : ratio >= 0.8 ? 3 : ratio >= 0.55 ? 2 : ratio >= 0.3 ? 1 : 0;
  // A dictionary word or a keyboard pattern can never count as strong, however
  // many other boxes it happens to tick.
  if (common && tier > 1) tier = 1;
  else if (patterned && tier > 2) tier = 2;
  const estimate = estimateCrackTime(password, common, patterned);

  return {
    rules,
    passed,
    tier,
    scored: password.length > 0,
    crackTime: estimate.label,
    logSeconds: estimate.logSeconds,
  };
}

const TIERS = [
  { label: "Way too weak", color: "#e93f5c", note: "A computer would crack this before you finish blinking." },
  { label: "Still weak", color: "#e93f5c", note: "Keep going. This one is still easy to guess." },
  { label: "Getting there", color: "#d9820b", note: "Halfway there. Fix the items in the list below." },
  { label: "Strong", color: "#059e86", note: "Nice. A guesser would need serious time for this." },
  { label: "Unbreakable", color: "#067a68", note: "Every rule passed. This is a proper password." },
];

const TICKS = [
  { label: "1 sec", log: 0 },
  { label: "1 min", log: Math.log10(60) },
  { label: "1 hr", log: Math.log10(3600) },
  { label: "1 day", log: Math.log10(86400) },
  { label: "1 yr", log: Math.log10(31_557_600) },
  { label: "1k yr", log: 10.5 },
  { label: "1M yr", log: 13.5 },
  { label: "forever", log: MAX_LOG_SECONDS },
];

export function PasswordLab() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [generated, setGenerated] = useState<{ value: string; parts: string[] } | null>(null);

  const analysis = useMemo(() => analyse(password), [password]);
  const tier = TIERS[analysis.tier];
  const failing = analysis.rules.filter((rule) => !rule.ok);
  const markerPercent = Math.max(1.5, Math.min(98.5, (analysis.logSeconds / MAX_LOG_SECONDS) * 100));

  function generate() {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const secondAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const number = Math.floor(Math.random() * 90) + 10;
    const symbol = ["!", "?", "#", "$", "%"][Math.floor(Math.random() * 5)];
    const value = `${adjective}${animal}${symbol}${secondAnimal}${number}`;
    setPassword(value);
    setGenerated({ value, parts: [adjective, animal, symbol, secondAnimal, String(number)] });
    setVisible(true);
  }

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="tester-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id="tester-heading"
            className="font-display text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[var(--accent)]"
          >
            The lock picker
          </h2>
          <span className="tag">
            <Icon name="lock" className="size-3.5" /> Stays on your device
          </span>
        </div>

        <label htmlFor="password-input" className="label mt-4 text-base">
          Try a made-up password
        </label>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <input
              id="password-input"
              type={visible ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field h-16 pr-14 text-xl font-semibold tracking-wide"
              placeholder="Type something to test"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-describedby="password-verdict password-privacy"
            />
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              className="absolute right-2 top-2 grid size-12 place-items-center rounded-xl text-muted transition-colors hover:bg-cream hover:text-ink"
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
            >
              <Icon name={visible ? "eye-off" : "eye"} className="size-5" />
            </button>
          </div>
          <button type="button" onClick={generate} className="btn btn--outline h-16 shrink-0">
            <Icon name="sparkles" className="size-5" />
            Invent one
          </button>
        </div>

        <p id="password-privacy" className="mt-2.5 flex items-start gap-1.5 text-xs font-semibold text-muted">
          <Icon name="shield-check" className="mt-px size-3.5 shrink-0 text-teal" />
          Use a made-up password here, never a real one. Nothing on this page is sent anywhere.
        </p>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-muted">Strength</p>
            <p
              id="password-verdict"
              aria-live="polite"
              className="display-lg mt-1 transition-colors"
              style={{ color: analysis.scored ? tier.color : "var(--color-muted)" }}
            >
              {analysis.scored ? tier.label : "Waiting…"}
            </p>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted">
              {analysis.scored
                ? tier.note
                : "Start typing, or hit “Invent one” for a passphrase you can remember."}
            </p>
          </div>
          <p className="font-display text-sm font-bold tabular-nums text-muted">
            {analysis.passed}
            <span className="text-muted/60">/{analysis.rules.length} rules</span>
          </p>
        </div>

        <div className="mt-7">
          <div
            className="ladder"
            role="img"
            aria-label={
              analysis.scored
                ? `Estimated crack time: ${analysis.crackTime}.`
                : "Crack time ladder. Type a password to place the marker."
            }
          >
            <div className="ladder__rail" />
            {TICKS.map((tick, index) => {
              const left = (tick.log / MAX_LOG_SECONDS) * 100;
              return (
                <span key={tick.label} aria-hidden="true">
                  <span className="ladder__tick" style={{ left: `${left}%` }} />
                  <span
                    className={`ladder__tick-label ${index % 2 === 1 ? "hidden sm:block" : ""}`}
                    style={{
                      left: `${left}%`,
                      transform:
                        index === 0
                          ? "none"
                          : index === TICKS.length - 1
                            ? "translateX(-100%)"
                            : "translateX(-50%)",
                    }}
                  >
                    {tick.label}
                  </span>
                </span>
              );
            })}
            <span
              className="ladder__marker"
              style={{
                left: `${analysis.scored ? markerPercent : 1.5}%`,
                background: analysis.scored ? tier.color : "var(--color-ink)",
                color: analysis.scored ? tier.color : "var(--color-ink)",
              }}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-4">
            <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-muted">
              A cracking rig would need
            </span>
            <span
              className="font-display text-xl font-bold"
              style={{ color: analysis.scored ? tier.color : "var(--color-muted)" }}
            >
              {analysis.scored ? analysis.crackTime : "???"}
            </span>
            <span className="text-xs font-semibold text-muted/80">
              at 10 billion guesses per second
            </span>
          </div>
        </div>

        {generated ? (
          <div className="animate-pop mt-6 rounded-[1.1rem] border border-grape/20 bg-grape-soft/70 p-4">
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-grape">
              Your new passphrase
            </p>
            <p className="mt-1 select-all break-all font-mono text-lg font-bold">{generated.value}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {generated.parts.map((part, index) => (
                <span
                  key={`${part}-${index}`}
                  className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-ink/70 ring-1 ring-grape/15"
                >
                  {part}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Picture each piece as a little scene in your head. Five separate pictures are much easier to
              remember than a jumble of letters, and much harder for a computer to guess.
            </p>
          </div>
        ) : null}
      </section>

      <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
        <section aria-labelledby="checklist-heading">
          <h2 id="checklist-heading" className="flex items-center gap-2 font-display text-lg font-bold">
            <Icon name="check-circle" className="size-4 text-teal" />
            The checklist
          </h2>
          <ul className="mt-4 space-y-2.5">
            {analysis.rules.map((rule) => (
              <li key={rule.id} className="flex items-start gap-2.5 text-[0.95rem]">
                <span
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full transition-colors ${
                    rule.ok ? "bg-teal text-white" : "bg-cream text-ink/35"
                  }`}
                >
                  <Icon name={rule.ok ? "check" : "x"} className="size-3" strokeWidth={3} />
                </span>
                <span className={rule.ok ? "text-ink/65" : "font-semibold text-ink"}>
                  {rule.label}
                  {!rule.ok ? <span className="sr-only">, not met yet</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="powerups-heading">
          <h2 id="powerups-heading" className="flex items-center gap-2 font-display text-lg font-bold">
            <Icon name="lightbulb" className="size-4 text-amber" />
            Power-ups to try
          </h2>
          {failing.length === 0 ? (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {password.length > 0
                ? "Nothing left to fix. Now delete one character and watch how far the marker slides back. That is the whole lesson."
                : "Type a password and this list will tell you exactly what to change."}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {failing.slice(0, 4).map((rule) => (
                <li key={rule.id} className="border-l-2 border-amber/60 pl-3 text-sm leading-relaxed">
                  <span className="font-bold text-ink">{rule.label}. </span>
                  <span className="text-muted">{rule.hint}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 rounded-xl bg-cream/70 px-4 py-3 text-sm leading-relaxed text-muted">
            <span className="font-bold text-ink">The one to remember: </span>
            a long, simple password beats a short, complicated one, and you can remember it.
          </div>
        </section>
      </div>

      <section className="border-t border-line pt-8">
        <h2 className="display-lg">Now the important part</h2>
        <p className="mt-2 max-w-2xl text-[0.98rem] leading-relaxed text-muted">
          A strong password only helps if nobody else knows it. Sharing one with a friend, even your best
          friend, turns one strong password into two weak ones. Reusing one everywhere means a single leaked
          site can unlock all the others. Use a different password for every account and let a password manager
          remember them for you.
        </p>
      </section>
    </div>
  );
}
