import type { Metadata } from "next";
import { PasswordLab } from "@/components/labs/password-lab";
import { MissionShell } from "@/components/mission-shell";
import { getMission } from "@/lib/missions";

const mission = getMission("passwords")!;

export const metadata: Metadata = {
  title: "Password Power-Up",
  description:
    "Test a made-up password, watch its strength score change in real time, and learn why long passphrases beat complicated short ones.",
};

export default function PasswordMissionPage() {
  return (
    <MissionShell
      mission={mission}
      steps={[
        {
          title: "Try a made-up password",
          body: "Type anything that isn't a real password of yours: a pet's name, your favourite snack, a long phrase.",
        },
        {
          title: "Read the checklist",
          body: "Every rule you miss comes with a plain-English reason. Fix one thing at a time and watch the meter move.",
        },
        {
          title: "Invent one you'll remember",
          body: "Press “Invent one” to see a passphrase pattern you can reuse later for a real account.",
        },
      ]}
      mentorTip="Before they type, ask each student to guess how long their old password would take to crack. The gap between their guess and the number on screen is the whole lesson."
    >
      <PasswordLab />
    </MissionShell>
  );
}
