"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** localStorage key holding a JSON array of favorited template ids. */
export const FAVORITES_STORAGE_KEY = "kemas-favorite-templates";

interface UseFavoritesReturn {
  favoriteIds: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  count: number;
}

/** Safely parse a stored JSON string into a Set of string ids. */
function parseStoredIds(raw: string | null): Set<string> {
  if (!raw) return new Set();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((v): v is string => typeof v === "string"));
    }
  } catch {
    // fall through to empty set on malformed JSON
  }
  return new Set();
}

/**
 * Persistent template favorites backed by localStorage.
 *
 * - SSR-safe: initial state is an empty Set on server and first client render;
 *   real values are hydrated from localStorage in a mount effect (no hydration
 *   mismatch).
 * - Persists to localStorage on every change (gated until after hydration so the
 *   initial empty set never clobbers stored data).
 * - Syncs across browser tabs via the `storage` event.
 * - Falls back to an empty set on any parse error.
 */
export function useFavorites(): UseFavoritesReturn {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const hydrated = useRef(false);

  // Hydrate from localStorage on mount (client only).
  useEffect(() => {
    if (typeof window === "undefined") return;
    setFavoriteIds(parseStoredIds(window.localStorage.getItem(FAVORITES_STORAGE_KEY)));
    hydrated.current = true;
  }, []);

  // Persist on change — but only after hydration has run, so we don't overwrite
  // stored favorites with the initial empty set.
  useEffect(() => {
    if (typeof window === "undefined" || !hydrated.current) return;
    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify([...favoriteIds])
      );
    } catch {
      // ignore quota / unavailable storage — degrade to in-memory for the session
    }
  }, [favoriteIds]);

  // Cross-tab sync: react to changes made in other tabs.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== FAVORITES_STORAGE_KEY) return;
      setFavoriteIds(parseStoredIds(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds]
  );

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    count: favoriteIds.size,
  };
}
