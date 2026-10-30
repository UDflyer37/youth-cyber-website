import Link from "next/link";
import { Icon } from "@/components/icon";
import { missions } from "@/lib/missions";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="texture-dots pointer-events-none absolute inset-0 text-ink opacity-[0.09]"
        style={{
          maskImage: "radial-gradient(70% 70% at 50% 20%, #000, transparent 75%)",
          WebkitMaskImage: "radial-gradient(70% 70% at 50% 20%, #000, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <p className="numeral text-[7rem] leading-none text-grape/25 sm:text-[10rem]">404</p>
        <h1 className="display-xl mt-2">This page is locked.</h1>
        <p className="mx-auto mt-3 max-w-md text-[1rem] leading-relaxed text-muted">
          The address you followed doesn&apos;t lead anywhere, but nothing is broken. Pick a mission and carry
          on.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/#missions" className="btn btn--primary">
            <Icon name="home" className="size-4" />
            Back to the playground
          </Link>
          <Link href="/ai-lab" className="btn btn--outline">
            <Icon name="face" className="size-4" />
            Try the AI Lab
          </Link>
        </div>

        <ul className="mx-auto mt-10 flex max-w-lg flex-wrap justify-center gap-x-5 gap-y-2 border-t border-line pt-6">
          {missions.map((mission) => (
            <li key={mission.slug}>
              <Link
                href={mission.href}
                className="text-sm font-bold text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {mission.shortTitle}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
