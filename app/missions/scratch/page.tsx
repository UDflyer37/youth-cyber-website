import type { Metadata } from "next";
import { ScratchShowcase } from "@/components/labs/scratch-showcase";
import { MissionShell } from "@/components/mission-shell";
import { getMission } from "@/lib/missions";

const mission = getMission("scratch")!;

export const metadata: Metadata = {
  title: "Scratch Arcade",
  description:
    "Play games built by students in the program, then remix the idea into a cyber-themed project of your own.",
};

export default function ScratchMissionPage() {
  return (
    <MissionShell
      mission={mission}
      steps={[
        {
          title: "Pick a build",
          body: "Choose a project and press play. These are real Scratch projects running live on this page.",
        },
        {
          title: "Find the loop",
          body: "Open it in Scratch and look for the forever block. That loop is the heartbeat of every game.",
        },
        {
          title: "Remix it",
          body: "Change one thing, like speed, score, or art, then show someone what you made.",
        },
      ]}
      mentorTip="If Scratch is blocked on your school network, project one game from a single device and let students call out which blocks to change."
    >
      <ScratchShowcase />
    </MissionShell>
  );
}
