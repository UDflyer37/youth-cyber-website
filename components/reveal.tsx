"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Reveals its children with a short rise as they scroll into view. The hidden
 * state is applied only on the client and only to content that starts below the
 * fold, so the server-rendered page stays fully visible.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.94) return;

    element.setAttribute("data-reveal", "");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          element.setAttribute("data-reveal", "shown");
          observer.unobserve(element);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };
  const style = { "--reveal-delay": `${delay}ms` } as React.CSSProperties;

  if (as === "li") {
    return (
      <li ref={setRef} className={className} style={style}>
        {children}
      </li>
    );
  }

  return (
    <div ref={setRef} className={className} style={style}>
      {children}
    </div>
  );
}
