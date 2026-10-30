"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

const links = [
  { href: "/#missions", label: "Missions", match: "/missions" },
  { href: "/ai-lab", label: "AI Lab", match: "/ai-lab" },
  { href: "/#grown-ups", label: "Grown-ups", match: "/#grown-ups" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
        scrolled
          ? "border-b border-line/80 bg-paper/88 backdrop-blur-xl"
          : "border-b border-transparent bg-paper/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Cyber Adventure Playground home"

        >
          <span className="morph-blob relative grid size-10 shrink-0 place-items-center bg-ink text-paper transition-transform duration-300 group-hover:rotate-[14deg] sm:size-11">
            <Icon name="shield" className="size-5 sm:size-[1.35rem]" strokeWidth={2} />
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-paper bg-lime" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[1.02rem] font-bold leading-none tracking-[-0.035em] sm:text-[1.12rem]">
              Cyber Playground
            </span>
            <span className="mt-1 block text-[0.55rem] font-extrabold uppercase tracking-[0.19em] text-muted sm:text-[0.6rem]">
              Indian River · After school
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              (link.match === "/missions" && pathname.startsWith("/missions")) ||
              (link.match === "/ai-lab" && pathname === "/ai-lab");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative rounded-full px-3.5 py-2 text-[0.92rem] font-bold transition-colors ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-0.5 h-[2px] origin-left rounded-full bg-ink transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#missions"            className="btn btn--primary btn--sm hidden md:inline-flex"
          >
            Start a mission
            <Icon name="arrow-right" className="btn__arrow size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-paper px-3.5 text-sm font-bold text-ink transition-colors hover:border-ink md:hidden"
          >
            <Icon name={open ? "x" : "menu"} className="size-4" strokeWidth={2.4} />
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line/80 bg-paper/97 backdrop-blur-xl md:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 py-3">
          <ul>
            {links.map((link, index) => (
              <li key={link.href} className="border-b border-line/70 last:border-0">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 py-4"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="numeral text-sm text-muted/70">0{index + 1}</span>
                    <span className="font-display text-xl font-bold tracking-tight">{link.label}</span>
                  </span>
                  <Icon name="arrow-up-right" className="size-4 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#missions" onClick={() => setOpen(false)} className="btn btn--primary mt-4 mb-2 w-full">
            Start a mission
            <Icon name="arrow-right" className="btn__arrow size-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
