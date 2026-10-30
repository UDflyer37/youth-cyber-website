import type { Metadata } from "next";
import { CipherLab } from "@/components/labs/cipher-lab";
import { MissionShell } from "@/components/mission-shell";
import { getMission } from "@/lib/missions";

const mission = getMission("cipher")!;

export const metadata: Metadata = {
  title: "Code Breaker Academy",
  description:
    "Scramble a message with a Caesar cipher, share the key, and crack secret messages using only the alphabet.",
};

export default function CipherMissionPage() {
  return (
    <MissionShell
      mission={mission}
      steps={[
        {
          title: "Write a message",
          body: "Type something short, then move the shift key. Every letter slides the same number of places.",
        },
        {
          title: "Trade with a partner",
          body: "Share only the scrambled text. They need the shift number to read it. That number is the key.",
        },
        {
          title: "Crack a stranger's code",
          body: "In the playground you only get the ciphertext. Slide until real words appear.",
        },
      ]}
      mentorTip="Students often assume any cipher is unbreakable. Let them try all 25 shifts by hand once. The tedium is exactly why modern encryption needs huge keys."
    >
      <CipherLab />
    </MissionShell>
  );
}
