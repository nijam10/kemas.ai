# Design — Favorites Tab (persistent template favorites)

## Overview

Make Gallery template favorites **persistent** via `localStorage` and give them a destination: a "Favorites" tab on the History page. A new `useFavorites()` hook owns the favorite-id set, persists it, and syncs across tabs. The Gallery page swaps its in-memory `useState<Set>` for this hook. The History page wraps its existing content in a two-tab switcher ("Generations" = current content untouched, "Favorites" = a new grid of hearted templates rendered with the existing `TemplateCard`).

Frontend-only: `localStorage` for persistence, no backend, no `/api/`, no server actions, no backend-coupled hooks.

## Current State (ground truth)

Verified against the codebase:

| Item | Reality | Implication |
|---|---|---|
| Gallery favorites | `const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())` + local `toggleFavorite` + `favoriteIds.has(id)` passed as `TemplateCard.isFavorite` | Swap the three usages to the hook (`isFavorite`, `toggleFavorite`); in-memory state is lost on refresh today |
| `TemplateCard` props | `{ template, isFavorite, onToggleFavorite }` | Reused verbatim by the Favorites section; not modified |
| History page | Single `"use client"` component: hero (title + 2 stat cards + filter bar) → `grid lg:grid-cols-12` (col-span-9 grid + col-span-3 sidebar). Uses `useDesigns()` | Existing content becomes the "Generations" tab; tabs inserted below the hero, above the grid |
| `GALLERY_TEMPLATES` | Exported array of `PackagingTemplate` from `lib/gallery-templates.ts` | Favorites section filters this by id |
| `useToast` | State-only hook (no global renderer) | Not needed here |

The History page hero contains a filter bar (search + type + sort) that operates on generations. **Decision D3** covers where the tabs sit relative to that bar.

## Goals

- `useFavorites()` hook: `favoriteIds: Set<string>`, `isFavorite(id)`, `toggleFavorite(id)`, `count`.
- Persist to `localStorage["kemas-favorite-templates"]` (JSON string array); SSR-safe; cross-tab sync via `storage` event; graceful parse-error fallback.
- Gallery uses the hook (heart behavior unchanged, now persistent).
- History page: two-tab switcher; "Generations" unchanged, "Favorites" shows hearted templates.
- Favorites section reuses `TemplateCard`; unfavoriting removes a card immediately; empty state with a "Browse Gallery" link.

## Non-Goals

- No backend, `/api/`, or server actions. No changes to `useGallery`, `useCredits`, or any backend-coupled hook.
- No changes to `TemplateCard` props/rendering.
- No changes to the History "Generations" content beyond wrapping it in a tab.
- No changes to the Generate page or generation flow.
- No URL syncing of the active tab; no max-favorites limit.

### Files in scope (exhaustive)

| Action | File |
|---|---|
| Create | `lib/use-favorites.ts` |
| Create | `components/history/favorites-section.tsx` |
| Create (optional) | `components/history/history-tabs.tsx` (tab switcher UI) |
| Update | `app/(user)/gallery/page.tsx` (favorites state → hook) |
| Update | `app/(user)/history/page.tsx` (wrap content in tabs) |

No other file may be modified.

## Architecture

```
useFavorites()  (lib/use-favorites.ts)   ── owns Set<string>, localStorage, storage-event sync
   ├─ Gallery page   → heart toggle persists; TemplateCard.isFavorite = isFavorite(id)
   └─ History page
        ├─ HistoryTabs (Generations | Favorites)   ── local activeTab state
        ├─ Generations tab  → existing History content (untouched, conditionally shown)
        └─ Favorites tab    → <FavoritesSection />
                                  ├─ filter GALLERY_TEMPLATES by favoriteIds
                                  ├─ grid of <TemplateCard /> (reused)
                                  └─ empty state → Link /gallery
```

## Data Models

No DB/types change. Persistence shape:

```
localStorage key: "kemas-favorite-templates"
value: JSON string array of template ids, e.g. ["keripik-singkong-premium","bakpia-klasik"]
in-memory: Set<string>
```

## Components and Interfaces

### `useFavorites` — `lib/use-favorites.ts`

```ts
interface UseFavoritesReturn {
  favoriteIds: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  count: number;
}

export function useFavorites(): UseFavoritesReturn;
export const FAVORITES_STORAGE_KEY = "kemas-favorite-templates";
```

**Lifecycle / behavior:**
- **SSR-safe init:** `useState<Set<string>>(new Set())` — server render and first client render both start empty (no `localStorage` access during render). Avoids hydration mismatch.
- **Hydrate on mount:** a `useEffect` reads `localStorage[FAVORITES_STORAGE_KEY]`, JSON-parses to a string array, and sets the set. Wrapped in try/catch — on parse error or non-array, fall back to empty set (and optionally clear the bad key).
- **Persist on change:** a `useEffect` keyed on the set writes `JSON.stringify([...set])` back to `localStorage`. To avoid clobbering stored data with the initial empty set before hydration completes, gate writes behind a `hydrated` ref/flag (only persist after the first hydration effect has run).
- **Cross-tab sync:** a `useEffect` adds a `window` `storage` event listener; when `e.key === FAVORITES_STORAGE_KEY`, re-parse `e.newValue` into the set (guarded by try/catch). Cleaned up on unmount.
- **`toggleFavorite`:** functional `setState` cloning the set (add if absent, remove if present) — an involution per id.
- **`isFavorite(id)`** = `favoriteIds.has(id)`; **`count`** = `favoriteIds.size`.
- All `window`/`localStorage` access is `typeof window !== "undefined"` guarded.

### `HistoryTabs` — `components/history/history-tabs.tsx` (optional helper)

```ts
type HistoryTab = "generations" | "favorites";

interface HistoryTabsProps {
  active: HistoryTab;
  onChange: (tab: HistoryTab) => void;
  favoritesCount: number;
}
```

- Two tab buttons in a row with a bottom border container.
- Active: `text-[#F97316]` + 2px amber underline (`border-b-2 border-[#F97316]`). Inactive: `text-[#737373]`, no underline. Transition: `transition-all duration-300 ease-out`.
- Favorites label shows a count when `> 0`: `Favorites (3)`.

### `FavoritesSection` — `components/history/favorites-section.tsx`

```ts
// no props — reads the hook directly
export default function FavoritesSection(): JSX.Element;
```

- Calls `useFavorites()`, derives `favorites = GALLERY_TEMPLATES.filter(t => favoriteIds.has(t.id))` (memoized).
- **Empty state** (`count === 0` / no matches): centered lucide `Heart`, heading "No favorites yet", subtext "Browse the gallery to save templates you like.", amber button "Browse Gallery" → `Link href="/gallery"`. Styling matches existing empty states (centered, `py` spacing, amber primary button).
- **Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px]` mapping to `<TemplateCard template isFavorite onToggleFavorite />`. `isFavorite` is always `true` here, so clicking the heart unfavorites and the item drops out of the filtered list immediately (reactive).

### Gallery page change

Replace:
```ts
const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
// ...local toggleFavorite...
isFavorite={favoriteIds.has(template.id)}
onToggleFavorite={toggleFavorite}
```
with:
```ts
const { isFavorite, toggleFavorite } = useFavorites();
// ...
isFavorite={isFavorite(template.id)}
onToggleFavorite={toggleFavorite}
```
Remove the now-unused local `toggleFavorite` and the `favoriteIds` state. No other gallery behavior changes.

### History page change

- Add `const [activeTab, setActiveTab] = useState<HistoryTab>("generations")` and `const { count } = useFavorites()`.
- Insert `<HistoryTabs active={activeTab} onChange={setActiveTab} favoritesCount={count} />` directly below the hero block (see D3 for exact placement vs. the filter bar).
- Wrap the existing main grid (`grid lg:grid-cols-12 …`) so it renders only when `activeTab === "generations"`; render `<FavoritesSection />` when `activeTab === "favorites"`.
- The existing "Generations" markup, data fetching (`useDesigns`), filters, and sidebar are otherwise untouched.

## Behavior / Logic

- Heart toggles persist immediately to `localStorage` and reflect on both Gallery and the Favorites tab.
- Switching tabs is pure local state; the Generations tab keeps its own search/filter/sort state across switches (component stays mounted; only conditional rendering toggles).
- Unfavoriting in the Favorites tab removes the card on the next render because the filtered list recomputes from `favoriteIds`.
- Opening a second browser tab and favoriting there updates this tab via the `storage` event.

## Key Design Decisions

**D1 — Hook owns persistence; pages stay dumb.** Centralizing `localStorage` + `storage` sync in `useFavorites()` means Gallery and Favorites share one source of truth and the same id set, with no prop drilling. Each consumer gets its own React state instance, kept consistent through `localStorage` + the storage event (note: the storage event does not fire in the same tab that wrote it — see D2).

**D2 — Same-tab consistency across two `useFavorites()` instances.** The `storage` event only fires in *other* tabs. Within one tab, Gallery and the History Favorites tab are never mounted simultaneously (different routes), so each reads fresh from `localStorage` on mount via the hydration effect. This is sufficient for the navigation flow (Gallery → favorite → go to History → see it). No cross-instance event bus is needed. (If both were ever on screen at once, a shared store would be required; out of scope.)

**D3 — Tab placement vs. the existing filter bar.** The History hero currently bundles the title, stat cards, AND the generations filter bar. The filter bar only makes sense for Generations. Placement: render the **title + tabs** first; keep the **stat cards + filter bar inside the Generations tab** (or directly above the generations grid) so they don't show on the Favorites tab. Minimal-diff approach: insert tabs right after the `<h1>/description` block and gate the stat cards + filter bar + grid + sidebar together under `activeTab === "generations"`. This keeps the "Generations content untouched" guarantee (same markup, just conditionally rendered).

**D4 — Persist-after-hydrate guard.** Without a guard, the initial empty-set render would immediately overwrite stored favorites before the hydration effect runs. A `hydrated` flag ensures the persist effect is a no-op until after first hydration.

## Correctness Properties

### Property 1: Persistence round-trip
After `toggleFavorite(id)` adds an id, the value stored at `FAVORITES_STORAGE_KEY` parses to an array containing that id; a fresh `useFavorites()` mount hydrates a set equal to the stored array's contents.

**Validates: Requirements 1.2, 1.3, 2.1**

### Property 2: Toggle is an involution per id
Calling `toggleFavorite(id)` twice returns `favoriteIds` membership for that id to its prior value, and changes membership for no other id.

**Validates: Requirements 1.5, 5.3**

### Property 3: SSR-safe initial state
On the server and on the first client render, `favoriteIds` is empty and `isFavorite` returns false for every id (no `window`/`localStorage` access during render), preventing hydration mismatch.

**Validates: Requirements 1.4**

### Property 4: Parse-error resilience
If the stored value is missing, non-JSON, or not a string array, hydration yields an empty set and does not throw.

**Validates: Requirements 1.6**

### Property 5: Favorites view = filtered dataset
The Favorites grid shows exactly the templates in `GALLERY_TEMPLATES` whose id is in `favoriteIds` — no extras, no omissions; unknown/stale ids contribute no card.

**Validates: Requirements 4.2, 5.2**

### Property 6: Immediate removal on unfavorite
Unfavoriting a template while on the Favorites tab removes its card on the next render (the derived list no longer contains it).

**Validates: Requirements 5.3**

### Property 7: Count integrity
`count === favoriteIds.size`, and the Favorites tab badge shows this number when `> 0`.

**Validates: Requirements 3.4, 4.1**

## Error Handling

- **localStorage unavailable / throws** (private mode, quota): all reads/writes are wrapped in try/catch; failures degrade to in-memory-only behavior for the session (no crash).
- **Corrupt stored value:** caught during parse → empty set fallback (Property 4); optionally remove the bad key.
- **SSR:** no `window` access during render; effects run client-only (Property 3).
- **Stale ids** (a favorited template later removed from `GALLERY_TEMPLATES`): the filter simply yields no card for it; the id may remain in storage harmlessly (could be pruned in a future cleanup).

## Testing Strategy

- **Hook unit tests** (if a runner is added): round-trip persistence (P1), involution (P2), parse-error fallback (P4), count (P7), and storage-event sync updating the set. Mock `localStorage` + dispatch a `storage` event.
- **Component:** `HistoryTabs` highlights the active tab and shows the count badge only when `> 0`; `FavoritesSection` renders the empty state at count 0 and a grid of the correct cards otherwise; unfavoriting drops a card.
- **Integration:** favorite in Gallery → navigate to History Favorites tab → template appears; refresh → still present.
- **Build gate:** `npx tsc --noEmit` and `npm run build` must pass. No test runner is currently configured; if added it would be Vitest + Testing Library, otherwise the build/typecheck is the minimum gate.

## Known Trade-offs / Future Work

- **Two hook instances aren't live-synced within the same tab** (only across tabs via `storage`). Acceptable because Gallery and History Favorites are on different routes and never co-mounted (D2). A shared store (Zustand/context) would be the upgrade if they ever appear together.
- **Stale-id pruning** is not implemented; harmless but could be added.
- **Still client-only.** When a real backend favorites table exists, the hook can be swapped to sync server-side; the public hook API is designed to stay stable.

## Constraints Honored

- `localStorage` only; no backend/`/api/`/server actions; no `useGallery`/`useCredits` touched.
- `TemplateCard` reused unchanged.
- History "Generations" content preserved (conditionally rendered, same markup).
- Generate page and generation flow untouched.
- Active tab = amber text + 2px amber underline; inactive = muted; `transition-all duration-300 ease-out`.
- Favorites grid matches Gallery's 4/2/1 responsive layout with 14px gap.
- Tokens limited to the approved palette; lucide `Heart` for the empty state (non-AI icon).
