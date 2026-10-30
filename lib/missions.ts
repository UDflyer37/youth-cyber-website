export type MissionIcon = "lock" | "cipher" | "hook" | "blocks" | "face";

export type Mission = {
  slug: string;
  order: number;
  href: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: MissionIcon;
  accent: string;
  tint: string;
  skills: string[];
  minutes: string;
  level: string;
  /** The one thing a student should walk away knowing. */
  takeaway: string;
};

export const missions: Mission[] = [
  {
    slug: "passwords",
    order: 1,
    href: "/missions/passwords",
    title: "Password Power-Up",
    shortTitle: "Passwords",
    tagline: "Build a password that can't be guessed.",
    description:
      "Type a password and watch it get scored in real time. Learn why length beats cleverness, what makes a password weak, and how to invent one you can remember.",
    icon: "lock",
    accent: "#059e86",
    tint: "#ddf5ef",
    skills: ["Password strength", "Passphrases", "Cracking math"],
    minutes: "15 min",
    level: "Beginner",
    takeaway:
      "Long passwords beat complicated ones. Four random words are stronger than one clever word with symbols swapped in, and much easier to remember.",
  },
  {
    slug: "cipher",
    order: 2,
    href: "/missions/cipher",
    title: "Code Breaker Academy",
    shortTitle: "Secret codes",
    tagline: "Send secret messages like a real spy.",
    description:
      "Shift letters to turn a normal message into ciphertext, then try to crack secret messages written by other agents. All you need is the alphabet.",
    icon: "cipher",
    accent: "#5b3df5",
    tint: "#eee9ff",
    skills: ["Caesar cipher", "Encryption", "Pattern finding"],
    minutes: "20 min",
    level: "Beginner",
    takeaway:
      "Encryption scrambles a message with a key. A simple shift cipher only has 25 keys, so a computer can try them all instantly. Real encryption uses keys too big to guess.",
  },
  {
    slug: "phishing",
    order: 3,
    href: "/missions/phishing",
    title: "Phishing Defender",
    shortTitle: "Scam spotting",
    tagline: "Spot the fake before it hooks you.",
    description:
      "Read real-looking messages and decide what's trustworthy. Every answer comes with the clues you missed, so you learn to spot urgency, weird links, and too-good-to-be-true prizes.",
    icon: "hook",
    accent: "#e93f5c",
    tint: "#ffe7ec",
    skills: ["Red flags", "Link safety", "Asking an adult"],
    minutes: "15 min",
    level: "All levels",
    takeaway:
      "Scams rush you. Anything that says act now, click this link, or you won a prize is a signal to stop and check with a trusted adult instead of clicking.",
  },
  {
    slug: "scratch",
    order: 4,
    href: "/missions/scratch",
    title: "Scratch Arcade",
    shortTitle: "Scratch games",
    tagline: "Play games built by students like you.",
    description:
      "Play finished projects from the program, see how they were made, then remix the idea into a game of your own. Every project here started as somebody's first attempt.",
    icon: "blocks",
    accent: "#d9820b",
    tint: "#ffefd4",
    skills: ["Game logic", "Remixing", "Creative coding"],
    minutes: "Open ended",
    level: "All levels",
    takeaway:
      "Every app you use was built one small block at a time. Remixing someone else's project is how real programmers learn. It isn't cheating.",
  },
  {
    slug: "ai-lab",
    order: 5,
    href: "/ai-lab",
    title: "AI Face Lab",
    shortTitle: "AI face lab",
    tagline: "See how a computer finds a face.",
    description:
      "Turn on your camera and watch an AI model find your face in real time. Draw on the canvas, then watch your drawing wrap around your face as you move.",
    icon: "face",
    accent: "#2b7fe0",
    tint: "#e3efff",
    skills: ["Computer vision", "Model training", "Privacy"],
    minutes: "10 min",
    level: "Explorer",
    takeaway:
      "The AI doesn't see your face the way you do. It looks for patterns of light and dark. Nothing here is uploaded: the video stays inside your browser.",
  },
];

export function getMission(slug: string): Mission | undefined {
  return missions.find((mission) => mission.slug === slug);
}

export function getNeighbours(slug: string) {
  const index = missions.findIndex((mission) => mission.slug === slug);
  if (index === -1) return { previous: undefined, next: undefined };
  return {
    previous: index > 0 ? missions[index - 1] : undefined,
    next: index < missions.length - 1 ? missions[index + 1] : undefined,
  };
}

export const TOTAL_MISSIONS = missions.length;
