import type { Metadata } from "next";
import { FaceLab } from "@/components/labs/face-lab";
import { MissionShell } from "@/components/mission-shell";
import { getMission } from "@/lib/missions";

const mission = getMission("ai-lab")!;

export const metadata: Metadata = {
  title: "AI Face Lab",
  description:
    "Watch a machine-learning model find your face in real time, learn what landmarks it uses, and draw on yourself, all on your own device.",
};

export default function AiLabPage() {
  return (
    <MissionShell
      mission={mission}
      steps={[
        {
          title: "Turn on the camera",
          body: "The model loads in your browser and reads your camera directly. Nothing is uploaded or recorded.",
        },
        {
          title: "Watch the landmarks",
          body: "The dashed box is your face. The dots are the points the model uses to make that guess.",
        },
        {
          title: "Draw on yourself",
          body: "Pick a colour and paint inside the dashed box. Your drawing is stored on the face, so it moves when you move.",
        },
      ]}
      mentorTip="Ask what the model measures. It has no idea what a face is; it only knows patterns of light and dark. Then ask who might be recognised badly, and why."
    >
      <FaceLab />
    </MissionShell>
  );
}
