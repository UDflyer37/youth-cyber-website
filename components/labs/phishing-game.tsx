"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

type Message = {
  from: string;
  email: string;
  subject: string;
  body: string;
  scam: boolean;
  why: string;
  clues: string[];
};

const POOL: Message[] = [
  {
    from: "Prize Central",
    email: "winner@prize-claim-now.info",
    subject: "You've won a Nintendo Switch!!",
    body: "Congratulations! Your email address was selected in our weekly draw. Click the link below within 24 hours or your prize will be given to someone else.",
    scam: true,
    why: "You can't win a contest you never entered. The 24-hour deadline exists to stop you from thinking it through.",
    clues: ["A prize you never entered", "Urgency: “within 24 hours”", "A strange sender address"],
  },
  {
    from: "Mrs. Patel",
    email: "apatel@indianriverschool.org",
    subject: "Library books due Friday",
    body: "Hi everyone, a reminder that library books are due this Friday. Please bring them to the media center before homeroom. Thanks! Mrs. Patel",
    scam: false,
    why: "It comes from a school address, it names a real place in the building, and it asks for nothing except returning a book.",
    clues: ["Known sender", "No links to click", "A normal, boring request"],
  },
  {
    from: "Indian River Bank",
    email: "security@ir-bank-secure-login.com",
    subject: "Your account has been locked",
    body: "We detected unusual activity. Your online banking has been suspended. Verify your identity now to restore access: http://ir-bank-secure-login.com/verify",
    scam: true,
    why: "Real banks never ask you to log in through a link in an email. The address only looks right. It ends in -secure-login.com, not the bank's real domain.",
    clues: ["Lookalike web address", "Threat of losing access", "Asks you to log in"],
  },
  {
    from: "Scratch Team",
    email: "noreply@scratch.mit.edu",
    subject: "Someone loved your project",
    body: "Your project “Pixel Escape” just got 10 new loves. Keep creating! You can see your project on your profile whenever you like.",
    scam: false,
    why: "It's from the real scratch.mit.edu domain, it tells you to go to your own profile, and it doesn't ask for a password.",
    clues: ["Real domain", "No login link", "Nothing is being requested"],
  },
  {
    from: "Roblox Support",
    email: "support@roblox-verify.net",
    subject: "Account deletion in 24 hours",
    body: "Your account will be permanently deleted unless you confirm your password here: roblox-verify.net/confirm",
    scam: true,
    why: "No real company will ever ask for your password by email. The domain is roblox-verify.net, not roblox.com.",
    clues: ["Asks for your password", "Fake domain", "Countdown pressure"],
  },
  {
    from: "Coach Rivera",
    email: "crivera@indianriverschool.org",
    subject: "Practice moved to 4pm",
    body: "Heads up: the gym is being used for the science fair, so practice starts at 4pm instead of 3:30. Bring water.",
    scam: false,
    why: "A short message from a teacher you know, with a small practical change and nothing to click.",
    clues: ["Known sender", "Small, believable change", "No links or requests"],
  },
  {
    from: "Package Delivery",
    email: "no-reply@usps-redelivery-fee.top",
    subject: "Your parcel is waiting: $1.99 fee",
    body: "We attempted delivery today but nobody was home. Pay the small redelivery fee here to reschedule: https://usps-redelivery-fee.top/pay",
    scam: true,
    why: "Delivery companies don't email random addresses asking for card details. The “tiny fee” is the hook that gets your payment info.",
    clues: ["Small fee to unlock something", "Domain that isn't usps.com", "You weren't expecting a parcel"],
  },
  {
    from: "Mom",
    email: "unknown-number-4471@text-relay.biz",
    subject: "It's me, I lost my phone",
    body: "Don't call my old number. I need a favour. Can you buy two $50 gift cards and send me the codes? I'll pay you back tonight. Don't tell anyone yet.",
    scam: true,
    why: "This is a classic family-emergency scam. Gift card codes are like cash: once sent, the money is gone. Call your parent on a number you already know.",
    clues: ["Gift card codes", "New number", "“Don't tell anyone”"],
  },
  {
    from: "Khan Academy",
    email: "no-reply@khanacademy.org",
    subject: "New lesson: intro to cryptography",
    body: "A new lesson was added to your saved course. Open your dashboard whenever you have a few minutes to try it.",
    scam: false,
    why: "A real education site telling you to visit your own dashboard. No password, no payment, no deadline.",
    clues: ["Recognisable domain", "Points you to the site yourself", "No sensitive request"],
  },
  {
    from: "IT Helpdesk",
    email: "it-help@indianriver-support.co",
    subject: "Verify your school login today",
    body: "All student accounts must be verified before Friday. Enter your username and password here: https://tinyurl.com/ir-verify-now",
    scam: true,
    why: "A shortened link hides where it really goes, and no helpdesk needs your password. They can reset it without it.",
    clues: ["Shortened link hides the destination", "Asks for your password", "Fake “IT” domain"],
  },
  {
    from: "Free V-Bucks",
    email: "gifts@vbucks-generator-free.xyz",
    subject: "Free V-Bucks: enter a login",
    body: "Get 10,000 free V-Bucks! Just enter your friend's account login and we'll add the coins instantly. No surveys!",
    scam: true,
    why: "Free currency generators only exist to steal accounts. Using a friend's login also means you'd be the one breaking the rules.",
    clues: ["Free money", "Wants someone's login", "Address ends in .xyz"],
  },
  {
    from: "Game Store",
    email: "receipts@realgamestore.com",
    subject: "Your receipt for order #A1293",
    body: "Thanks for your order. To see the receipt, sign in to your account on our website as usual. We will never ask for your password by email.",
    scam: false,
    why: "Real companies tell you to sign in yourself rather than through an emailed link. That's exactly the safe pattern to look for.",
    clues: ["Tells you to sign in yourself", "No link to click", "Says it won't ask for a password"],
  },
  {
    from: "Windows Security",
    email: "alert@pc-protect-now.support",
    subject: "URGENT: 5 viruses found on your computer",
    body: "Your device is infected. Call 1-800-555-0199 immediately and let our technician connect remotely to clean it. Do not restart.",
    scam: true,
    why: "Scary pop-ups and phone numbers are a scam called tech support fraud. Nobody can scan your computer from an email.",
    clues: ["Scary language", "Phone number to call", "Wants remote access"],
  },
  {
    from: "Yearbook Club",
    email: "yearbook@indianriverschool.org",
    subject: "Photos due next Wednesday",
    body: "Upload your club photos to the folder your teacher shared in class. If you don't have the folder link, ask at the front office. Don't reply with files attached.",
    scam: false,
    why: "A school club asking you to use a link you already have, and warning you not to send files to an email. Thoughtful and safe.",
    clues: ["School domain", "Reuses a known link", "Tells you not to send files"],
  },
];

const ROUNDS = 10;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function rankFor(score: number) {
  if (score >= 9) return { title: "Scam Sniper", note: "Almost nothing gets past you." };
  if (score >= 7) return { title: "Phishing Defender", note: "Strong instincts. Keep checking the sender." };
  if (score >= 5) return { title: "Link Looker", note: "You caught the obvious ones. Read the address bar every time." };
  if (score >= 3) return { title: "Rookie", note: "Good start. The deadline tricks are the sneaky ones." };
  return { title: "Fresh Recruit", note: "Everyone starts here. Try again and watch the clues." };
}

type Phase = "idle" | "playing" | "answered" | "done";
type Result = { scam: boolean; correct: boolean };

export function PhishingGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [deck, setDeck] = useState<Message[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const message = deck[round];

  function start() {
    setDeck(shuffle(POOL).slice(0, ROUNDS));
    setRound(0);
    setScore(0);
    setStreak(0);
    setResults([]);
    setLastCorrect(false);
    setPhase("playing");
  }

  function answer(guessedScam: boolean) {
    if (phase !== "playing" || !message) return;
    const correct = guessedScam === message.scam;
    setLastCorrect(correct);
    setResults((current) => [...current, { scam: message.scam, correct }]);
    if (correct) {
      setScore((current) => current + 1);
      setStreak((current) => current + 1);
    } else {
      setStreak(0);
    }
    setPhase("answered");
  }

  function next() {
    if (round + 1 >= deck.length) {
      setPhase("done");
      return;
    }
    setRound((current) => current + 1);
    setPhase("playing");
  }

  /* -------------------------------------------------------------- idle cover */
  if (phase === "idle") {
    return (
      <div className="grid gap-8 sm:grid-cols-[1.05fr_0.95fr] sm:items-center">
        <div>
          <p className="font-display text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-coral">
            The inbox
          </p>
          <h2 className="display-lg mt-2">Ten messages. Real or scam?</h2>
          <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-muted">
            Read each one the way you&apos;d read your own inbox. Choose, then find out exactly which clues
            gave it away.
          </p>
          <div className="dot-list mt-4">
            <span>{ROUNDS} rounds</span>
            <span>No timer</span>
            <span>Instant explanations</span>
          </div>
          <button type="button" onClick={start} className="btn btn--accent btn--lg mt-6">
            <Icon name="mail-warning" className="size-5" />
            Open the inbox
          </button>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-[22rem]">
          {[2, 1, 0].map((layer) => (
            <div
              key={layer}
              className="absolute inset-x-0 rounded-[1rem] border border-line bg-paper p-3.5 shadow-[0_18px_36px_-30px_rgba(22,20,44,0.6)]"
              style={{
                top: `${(1 - layer) * 14}%`,
                transform: `rotate(${(1 - layer) * 3.5}deg)`,
                zIndex: layer,
                opacity: layer === 0 ? 1 : 0.7,
                bottom: `${(1 - layer) * 8}%`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="grid size-7 place-items-center rounded-full text-[0.6rem] font-bold text-white"
                  style={{ background: layer === 0 ? "#d9820b" : "#e93f5c" }}
                >
                  {layer === 0 ? "?" : "!"}
                </span>
                <span className="h-1.5 flex-1 rounded-full bg-ink/10" />
                <span className="h-1.5 w-6 rounded-full bg-ink/10" />
              </div>
              <p className="mt-3 font-display text-sm font-bold leading-snug text-ink/80">
                {layer === 2
                  ? "Library books due Friday"
                  : layer === 1
                    ? "You've won a prize!!"
                    : "Your account will be deleted"}
              </p>
              <div className="mt-2 space-y-1.5">
                <span className="block h-1.5 w-full rounded-full bg-ink/10" />
                <span className="block h-1.5 w-4/5 rounded-full bg-ink/10" />
                <span className="block h-1.5 w-2/3 rounded-full bg-ink/10" />
              </div>
              {layer === 0 ? (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-coral/10 px-2 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-coral">
                  <Icon name="mail-warning" className="size-3" /> Suspicious
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------- final score */
  if (phase === "done") {
    const rank = rankFor(score);
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / Math.max(deck.length, 1)) * circumference;

    return (
      <div className="animate-pop">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
          <div className="relative grid size-[9.5rem] shrink-0 place-items-center">
            <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden="true">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--color-cream)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="var(--color-coral)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="text-center">
              <span className="block font-display text-4xl font-bold leading-none">{score}</span>
              <span className="text-xs font-bold text-muted">of {deck.length}</span>
            </div>
          </div>
          <div>
            <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-muted">Final rank</p>
            <h2 className="display-lg mt-1 text-coral">{rank.title}</h2>
            <p className="mt-1.5 max-w-sm text-[0.95rem] text-muted">{rank.note}</p>
            <button type="button" onClick={start} className="btn btn--accent mt-4">
              <Icon name="refresh" className="size-4" />
              Play again
            </button>
          </div>
        </div>

        <ol className="mt-8 border-t border-line">
          {deck.map((item, index) => {
            const result = results[index];
            return (
              <li
                key={`${item.email}-${index}`}
                className="flex items-center gap-3 border-b border-line/70 py-2.5 text-sm"
              >
                <Icon
                  name={result?.correct ? "check" : "x"}
                  className={`size-4 shrink-0 ${result?.correct ? "text-teal" : "text-coral"}`}
                  strokeWidth={2.8}
                />
                <span className="min-w-0 flex-1 truncate text-ink/75">{item.subject}</span>
                <span className="shrink-0 text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-muted/70">
                  {item.scam ? "Scam" : "Real"}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (!message) return null;

  /* ------------------------------------------------------------------ playing */
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="score-rail flex-1" aria-hidden="true">
          {deck.map((_, index) => {
            const state = results[index]
              ? results[index].correct
                ? "correct"
                : "wrong"
              : index === round
                ? "current"
                : "pending";
            return <span key={`seg-${index}`} data-state={state} />;
          })}
        </div>
        <p className="shrink-0 text-xs font-bold text-muted" aria-live="polite">
          {Math.min(round + 1, deck.length)}/{deck.length}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-muted">
          Score <span className="text-ink">{score}</span>
        </p>
        {streak >= 2 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber/15 px-2.5 py-1 text-xs font-bold text-amber">
            <Icon name="sparkles" className="size-3.5" /> {streak} in a row
          </span>
        ) : (
          <span className="text-xs font-semibold text-muted/70">Read the sender first</span>
        )}
      </div>

      <div className="mail-window mt-4">
        <div className="mail-chrome">
          <span className="chrome-dot" />
          <span className="chrome-dot" />
          <span className="chrome-dot" />
          <p className="ml-2 truncate text-[0.68rem] font-bold text-ink/45">Inbox · 1 unread</p>
        </div>

        <div className="flex items-start gap-3 border-b border-line bg-cream/35 px-4 py-3.5 sm:px-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white font-display text-base font-bold text-ink ring-1 ring-line">
            {message.from.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[0.95rem] font-bold">{message.from}</p>
            <p className="truncate font-mono text-[0.7rem] text-muted">&lt;{message.email}&gt;</p>
          </div>
          <span className="hidden shrink-0 text-[0.65rem] font-bold text-muted sm:block">to me</span>
        </div>

        <div className="px-4 pb-5 pt-4 sm:px-6">
          <h2 className="font-display text-xl font-bold leading-snug sm:text-2xl">{message.subject}</h2>
          <p className="mt-2.5 whitespace-pre-line text-[0.98rem] leading-relaxed text-ink/80">{message.body}</p>
        </div>

        {phase === "playing" ? (
          <div className="grid gap-2.5 border-t border-line bg-cream/25 px-4 py-4 sm:grid-cols-2 sm:px-6">
            <button
              type="button"
              onClick={() => answer(false)}
              className="btn h-14 border-teal/45 bg-paper text-teal hover:bg-teal/5"


            >
              <Icon name="check-circle" className="size-5" />
              Looks safe
            </button>
            <button
              type="button"
              onClick={() => answer(true)}
              className="btn btn--accent h-14"


            >
              <Icon name="mail-warning" className="size-5" />
              It&apos;s a scam
            </button>
          </div>
        ) : (
          <div
            className={`animate-pop border-t px-4 py-5 sm:px-6 ${
              lastCorrect ? "border-teal/30 bg-teal/10" : "border-coral/30 bg-coral/10"
            }`}
          >
            <p
              className={`flex items-center gap-2 font-display text-lg font-bold ${
                lastCorrect ? "text-teal" : "text-coral"
              }`}
            >
              <Icon name={lastCorrect ? "check-circle" : "x"} className="size-5" strokeWidth={2.4} />
              {lastCorrect ? "Correct" : "Not quite"}: this one is {message.scam ? "a scam" : "safe"}.
            </p>
            <p className="mt-2 text-[0.94rem] leading-relaxed text-ink/80">{message.why}</p>
            <div className="mt-3">
              <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-muted">
                {message.scam ? "The clues" : "Why it earns trust"}
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {message.clues.map((clue) => (
                  <li key={clue} className="tag">
                    {clue}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={next}
              className="btn btn--primary mt-4 w-full sm:w-auto"

            >
              {round + 1 >= deck.length ? "See my score" : "Next message"}
              <Icon name="arrow-right" className="size-4" />
            </button>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-[0.7rem] font-semibold text-muted">
        Every message here was written for this activity. None of the links work and none of it is real.
      </p>
    </div>
  );
}
