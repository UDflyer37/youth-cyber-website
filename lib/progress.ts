"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cyberkids.badges.v1";
const EVENT = "cyberkids:badges";

function readBadges(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeBadges(badges: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
  } catch {
    // Private browsing or a full quota: badges are a nice-to-have, so fail quietly.
  }
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Badges are stored on the student's own device only. There is no account,
 * no server call, and nothing to sign up for.
 */
export function useBadges() {
  const [badges, setBadges] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setBadges(readBadges());
      setReady(true);
    };
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const award = useCallback((slug: string) => {
    const current = readBadges();
    if (current.includes(slug)) return;
    writeBadges([...current, slug]);
  }, []);

  const clear = useCallback(() => {
    writeBadges([]);
  }, []);

  const has = useCallback((slug: string) => badges.includes(slug), [badges]);

  return { badges, ready, award, clear, has };
}
