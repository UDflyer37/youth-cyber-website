"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A quiet layer of soap bubbles drifting behind the content on every page.
 * They bounce off the edges of the screen, get a little braver when you point
 * at them, and pop if you catch one, then float back in somewhere else.
 *
 * The layer itself never blocks the page: only the bubbles themselves take
 * pointer events, and only where a real pointer exists.
 */

type Bubble = {
  id: number;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  tint: string;
  phase: number;
  wobble: number;
  popped: boolean;
};

const TINTS = [
  "rgba(183, 230, 75, 0.55)",
  "rgba(126, 200, 255, 0.55)",
  "rgba(255, 170, 190, 0.55)",
  "rgba(186, 160, 255, 0.55)",
  "rgba(120, 230, 205, 0.55)",
];

const MAX_BUBBLES = 13;

function between(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function place(node: HTMLElement, bubble: Bubble) {
  const size = bubble.radius * 2;
  node.style.width = `${size}px`;
  node.style.height = `${size}px`;
  node.style.transform = `translate3d(${bubble.x - bubble.radius}px, ${bubble.y - bubble.radius}px, 0)`;
}

function makeBubble(id: number, width: number, height: number): Bubble {
  const radius = between(8, 22);
  const speed = between(6, 17);
  const angle = between(0, Math.PI * 2);
  return {
    id,
    x: between(radius, Math.max(radius + 1, width - radius)),
    y: between(radius, Math.max(radius + 1, height - radius)),
    radius,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    tint: TINTS[id % TINTS.length],
    phase: between(0, Math.PI * 2),
    wobble: between(0.5, 1.4),
    popped: false,
  };
}

export function BubbleField() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [interactive, setInteractive] = useState(false);
  const nodes = useRef(new Map<number, HTMLSpanElement | null>());
  const live = useRef<Bubble[]>([]);
  const box = useRef({ width: 0, height: 0 });
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setInteractive(fine);

    box.current = { width: window.innerWidth, height: window.innerHeight };
    const count = Math.round(
      Math.min(MAX_BUBBLES, Math.max(5, (window.innerWidth * window.innerHeight) / 160000)),
    );
    const next = Array.from({ length: count }, (_, index) =>
      makeBubble(index, box.current.width, box.current.height),
    );
    live.current = next;
    setBubbles(next);

    const paint = (bubble: Bubble) => {
      const node = nodes.current.get(bubble.id);
      if (node) place(node, bubble);
    };

    const onResize = () => {
      box.current = { width: window.innerWidth, height: window.innerHeight };
      for (const bubble of live.current) {
        bubble.x = Math.min(Math.max(bubble.x, bubble.radius), box.current.width - bubble.radius);
        bubble.y = Math.min(Math.max(bubble.y, bubble.radius), box.current.height - bubble.radius);
        paint(bubble);
      }
    };
    window.addEventListener("resize", onResize);

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(48, now - last) / 1000;
      last = now;
      const { width, height } = box.current;

      for (const bubble of live.current) {
        if (bubble.popped) continue;

        // A gentle sideways wobble so the drift never looks mechanical.
        bubble.phase += delta * bubble.wobble;
        bubble.x += (bubble.vx + Math.sin(bubble.phase) * 4) * delta;
        bubble.y += (bubble.vy + Math.cos(bubble.phase * 0.7) * 3) * delta;

        const r = bubble.radius;
        if (bubble.x < r) {
          bubble.x = r;
          bubble.vx = Math.abs(bubble.vx);
        } else if (bubble.x > width - r) {
          bubble.x = Math.max(r, width - r);
          bubble.vx = -Math.abs(bubble.vx);
        }
        if (bubble.y < r) {
          bubble.y = r;
          bubble.vy = Math.abs(bubble.vy);
        } else if (bubble.y > height - r) {
          bubble.y = Math.max(r, height - r);
          bubble.vy = -Math.abs(bubble.vy);
        }

        paint(bubble);
      }

      frame = requestAnimationFrame(tick);
    };

    if (!reduced) frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, []);

  function pop(bubble: Bubble) {
    const node = nodes.current.get(bubble.id);
    if (!node || bubble.popped) return;

    bubble.popped = true;
    node.dataset.popped = "true";

    const timer = window.setTimeout(
      () => {
        const { width, height } = box.current;
        bubble.radius = between(8, 22);
        bubble.x = between(bubble.radius + 8, Math.max(bubble.radius + 9, width - bubble.radius - 8));
        bubble.y = between(bubble.radius + 8, Math.max(bubble.radius + 9, height - bubble.radius - 8));
        const speed = between(6, 17);
        const angle = between(0, Math.PI * 2);
        bubble.vx = Math.cos(angle) * speed;
        bubble.vy = Math.sin(angle) * speed;
        bubble.popped = false;
        delete node.dataset.popped;
        place(node, bubble);
      },
      between(900, 2200),
    );
    timers.current.push(timer);
  }

  // Position the bubbles as soon as their nodes exist, and again whenever the
  // set is rebuilt, so nothing flashes in the corner.
  useEffect(() => {
    for (const bubble of bubbles) {
      const node = nodes.current.get(bubble.id);
      if (node) place(node, bubble);
    }
  }, [bubbles]);

  return (
    <div className="bubble-field" aria-hidden="true">
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className="bubble"
          data-interactive={interactive ? "true" : "false"}
          style={{ "--bubble-tint": bubble.tint } as React.CSSProperties}
          ref={(node) => {
            nodes.current.set(bubble.id, node);
          }}
          onPointerDown={() => pop(bubble)}
        >
          <span className="bubble__skin" />
        </span>
      ))}
    </div>
  );
}
