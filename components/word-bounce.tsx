"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/icon";

/**
 * The divider between the hero and the mission gallery. Instead of a ticker
 * that scrolls off the end, the words are loose in a narrow bar: they drift,
 * bounce off the walls, and clatter into each other. Point at one and it leans
 * out of the way; poke one and it gets a shove.
 */

const WORDS: { label: string; icon: IconName; color: string }[] = [
  { label: "Passwords", icon: "lock", color: "#b7e64b" },
  { label: "Secret codes", icon: "cipher", color: "#9ed8ff" },
  { label: "Scam spotting", icon: "mail-warning", color: "#ffc2ce" },
  { label: "AI & faces", icon: "face", color: "#d8c8ff" },
  { label: "Scratch builds", icon: "blocks", color: "#ffd79a" },
  { label: "Digital clues", icon: "sparkles", color: "#9ff0dd" },
];

type Chip = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
};

function between(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function WordBounce() {
  const [words] = useState(WORDS);
  const bandRef = useRef<HTMLDivElement | null>(null);
  const nodes = useRef(new Map<number, HTMLSpanElement | null>());
  const chips = useRef<Chip[]>([]);
  const bounds = useRef({ width: 0, height: 0 });
  const visible = useRef(true);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      const rect = band.getBoundingClientRect();
      bounds.current = {
        width: rect.width || band.clientWidth || window.innerWidth,
        height: rect.height || band.clientHeight || 84,
      };
    };

    const clampChip = (chip: Chip) => {
      const { width, height } = bounds.current;
      const minX = chip.width / 2 + 2;
      const maxX = Math.max(minX, width - chip.width / 2 - 2);
      const minY = chip.height / 2 + 1;
      const maxY = Math.max(minY, height - chip.height / 2 - 1);
      chip.x = Math.min(Math.max(chip.x, minX), maxX);
      chip.y = Math.min(Math.max(chip.y, minY), maxY);
    };

    const build = () => {
      measure();
      const { width: bandWidth, height: bandHeight } = bounds.current;

      if (chips.current.length !== words.length) {
        chips.current = words.map((_, index) => {
          const node = nodes.current.get(index);
          const width = node?.offsetWidth || 100;
          const height = node?.offsetHeight || 34;
          const angle = between(0, Math.PI * 2);
          const speed = between(26, 46);
          return {
            id: index,
            x: between(width / 2 + 4, Math.max(width / 2 + 5, bandWidth - width / 2 - 4)),
            y: between(height / 2 + 2, Math.max(height / 2 + 3, bandHeight - height / 2 - 2)),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * (speed * 0.55),
            width,
            height,
          };
        });
      } else {
        for (const chip of chips.current) {
          const node = nodes.current.get(chip.id);
          chip.width = node?.offsetWidth || chip.width;
          chip.height = node?.offsetHeight || chip.height;
          clampChip(chip);
        }
      }

      for (const chip of chips.current) {
        const node = nodes.current.get(chip.id);
        if (!node) continue;
        node.style.left = "0px";
        node.style.top = "0px";
        node.style.transform = `translate3d(${chip.x - chip.width / 2}px, ${chip.y - chip.height / 2}px, 0)`;
      }
    };

    build();

    // The first measure can land before styles are applied; watch the bar so
    // the chips get real bounds as soon as it has them.
    const resizeObserver = new ResizeObserver(() => build());
    resizeObserver.observe(band);
    window.addEventListener("resize", build);

    const observer = new IntersectionObserver(
      (entries) => {
        visible.current = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(band);

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(46, now - last) / 1000;
      last = now;

      if (visible.current) {
        const { width, height } = bounds.current;
        const list = chips.current;

        for (const chip of list) {
          chip.x += chip.vx * delta;
          chip.y += chip.vy * delta;

          const minX = chip.width / 2 + 2;
          const maxX = Math.max(minX, width - chip.width / 2 - 2);
          const minY = chip.height / 2 + 1;
          const maxY = Math.max(minY, height - chip.height / 2 - 1);

          if (chip.x < minX) {
            chip.x = minX;
            chip.vx = Math.abs(chip.vx);
          } else if (chip.x > maxX) {
            chip.x = maxX;
            chip.vx = -Math.abs(chip.vx);
          }
          if (chip.y < minY) {
            chip.y = minY;
            chip.vy = Math.abs(chip.vy);
          } else if (chip.y > maxY) {
            chip.y = maxY;
            chip.vy = -Math.abs(chip.vy);
          }
        }

        // Bumper-car collisions: nudge the pair apart and trade momentum.
        for (let i = 0; i < list.length; i += 1) {
          for (let j = i + 1; j < list.length; j += 1) {
            const a = list[i];
            const b = list[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const overlapX = (a.width + b.width) / 2 + 3 - Math.abs(dx);
            const overlapY = (a.height + b.height) / 2 + 2 - Math.abs(dy);

            if (overlapX > 0 && overlapY > 0) {
              if (overlapX < overlapY) {
                const push = (overlapX / 2) * (dx < 0 ? -1 : 1);
                a.x -= push;
                b.x += push;
                const swap = a.vx;
                a.vx = b.vx || 20;
                b.vx = swap || -20;
              } else {
                const push = (overlapY / 2) * (dy < 0 ? -1 : 1);
                a.y -= push;
                b.y += push;
                const swap = a.vy;
                a.vy = b.vy || 14;
                b.vy = swap || -14;
              }
            }
          }
        }

        // A collision must never be able to shove a chip through a wall.
        for (const chip of list) {
          clampChip(chip);
          const node = nodes.current.get(chip.id);
          if (!node) continue;
          node.style.transform = `translate3d(${chip.x - chip.width / 2}px, ${chip.y - chip.height / 2}px, 0)`;
          node.style.setProperty("--tilt", `${Math.max(-6, Math.min(6, chip.vx * 0.1))}deg`);
        }
      }

      frame = requestAnimationFrame(tick);
    };

    if (!reduced) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", build);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, [words]);

  function shove(index: number) {
    const chip = chips.current.find((item) => item.id === index);
    const node = nodes.current.get(index);
    if (!chip) return;
    chip.vx += between(-70, 70);
    chip.vy += between(-40, 40);
    if (node) {
      node.classList.remove("is-kicked");
      // Restart the little spin even when chips are tapped twice quickly.
      void node.offsetWidth;
      node.classList.add("is-kicked");
      window.setTimeout(() => node.classList.remove("is-kicked"), 420);
    }
  }

  return (
    <div className="bounce-band" ref={bandRef} aria-hidden="true">
      <div className="bounce-band__grid" />
      {words.map((word, index) => (
        <span
          key={word.label}
          ref={(node) => {
            nodes.current.set(index, node);
          }}
          className="word-chip"
          style={
            {
              "--chip-color": word.color,
              left: `${((index + 0.5) / words.length) * 100}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            } as React.CSSProperties
          }
          onPointerDown={() => shove(index)}
        >
          <span className="word-chip__pill">
            <Icon name={word.icon} className="size-3.5 shrink-0" strokeWidth={2.4} />
            {word.label}
          </span>
        </span>
      ))}
    </div>
  );
}
