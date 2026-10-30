import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { BubbleField } from "@/components/bubble-field";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  adjustFontFallback: false,
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const quirk = Fraunces({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cyber Adventure Playground · Indian River After School",
    template: "%s · Cyber Adventure Playground",
  },
  description:
    "Hands-on cybersecurity missions for elementary and middle school students: build stronger passwords, crack secret codes, spot phishing scams, and explore how AI sees a face.",
  keywords: [
    "cybersecurity for kids",
    "after school program",
    "password safety",
    "phishing game",
    "cipher activity",
    "AI for students",
  ],
  openGraph: {
    title: "Cyber Adventure Playground",
    description:
      "Five hands-on cybersecurity missions for young learners. No sign-up, nothing to install.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${quirk.variable}`}>
      <body className="min-h-dvh antialiased">
        <div className="page-glow" aria-hidden="true" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <BubbleField />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
