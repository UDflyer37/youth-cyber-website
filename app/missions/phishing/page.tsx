import type { Metadata } from "next";
import { PhishingGame } from "@/components/labs/phishing-game";
import { MissionShell } from "@/components/mission-shell";
import { getMission } from "@/lib/missions";

const mission = getMission("phishing")!;

export const metadata: Metadata = {
  title: "Phishing Defender",
  description:
    "Ten realistic messages, one decision each: safe or scam. Every answer comes with the clues you missed.",
};

export default function PhishingMissionPage() {
  return (
    <MissionShell
      mission={mission}
      steps={[
        {
          title: "Read like a detective",
          body: "Check the sender's actual address first. The display name can say anything at all.",
        },
        {
          title: "Look for pressure",
          body: "Countdowns, threats, prizes, gift cards, and “don't tell anyone” are the hooks to look for.",
        },
        {
          title: "Read the explanation",
          body: "After every answer you get the clues that were there. That explanation is the real lesson.",
        },
      ]}
      mentorTip="Play the first three rounds together as a class. Ask “what would make you click?” before revealing the answer. The reasoning matters more than the score."
    >
      <PhishingGame />
    </MissionShell>
  );
}
