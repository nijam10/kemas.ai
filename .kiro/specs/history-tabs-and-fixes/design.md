# Design — History Page Bug Fixes + Favorites Tab

## Overview

Two coordinated changes to `app/(user)/history/page.tsx` in one PR:

1. **Bug fixes** — four sidebar widgets render broken placeholder/seed content when there are 0 designs (Invalid Date, bare `*`, fake "Standing Pouch", a 60%-filled bar at 0 credits). Replace with conditional empty states at the rendering layer.
2. **Favorites tab** — wrap the page content in a two-tab switcher: "Generations" (the existing content + bug fixes) and "Favorites" (a grid of hearted templates), consuming the existing `useFavorites()` hook and reusing `TemplateCard` / `TemplateDetailModal` unchanged.

Frontend-only: rendering-layer fixes + local tab state + `localStorage`-backed favorites. No backend, `/api/`, data-hook, or Gallery changes.

## Current State (ground truth)

Verified against `app/(user)/history/page.tsx`:

| Item | Reality | Implication |
|---|---|---|
| Sidebar widgets | **All inline** in `page.tsx` (Recent Downloads, Last Generated, Favorite Type, This Week) — no separate widget files | Fix in-place; no widget components to extract or import |
| `history` | `(data?.designs ?? []).map(toDisplayItem)` from `useDesigns()`; empty array when 0 designs | Widgets must guard on `history.length`/`history[0]` |
| `getRelativeTime(dateString)` | `new Date(undefined)` → `NaN` → "Invalid Date" string | Called with `history[0]?.timestamp` which is `undefined` at 0 designs → the Invalid Date bug |
| Recent Downloads | Renders two rows from `history[0]`/`history[1]` unconditionally | At 0 designs both rows show empty name + "Invalid Date" |
| Last Generated | `history[0]?.name` (renders `*`?) + `type • date` row + always-enabled "View Design" → `handleView(undefined)` | Bare separator + broken nav at 0 designs |
| Favorite Type | `{history[0]?.type ?? "Standing Pouch"}` + "Most used type" | Fake type shown at 0 designs |
| This Week bar | hardcoded `style={{ width: '60%' }}` | Always 60% filled regardless of credits |
| `TemplateCard` | props `{ template, isFavorite, onToggleFavorite, onOpen }` | Reused unchanged |
| `TemplateDetailModal` | props `{ template, onClose }` | Reused unchanged |
| `useFavorites()` | exists in `lib/use-favorites.ts` (`favoriteIds`, `isFavorite`, `toggleFavorite`, `count`) | Consumed as-is |
| `GALLERY_TEMPLATES` | exists in `lib/gallery-templates.ts` | Filtered by `favoriteIds`; not modified |

> The `*` seen in "Last Generated" is the JSX rendering of `history[0]?.name` being `undefined` (renders nothing) — the visible asterisk is effectively empty content; the fix renders an explicit empty state instead.

## Goals

- Each buggy widget renders real data only when it exists; otherwise a clean muted empty state (no Invalid Date, no fake type, no phantom bar fill).
- "This Week" bar width is a real percentage that is `0%` when credits are 0.
- A two-tab switcher ("Generations" / "Favorites") below the page header.
- Generations tab = today's content (with fixes) including the sidebar; Favorites tab = full-width grid of favorited templates, no sidebar.
- Favorites grid reuses `TemplateCard` + `TemplateDetailModal`; unfavoriting removes a card immediately; empty state links to `/gallery`.

## Non-Goals

- No backend, `/api/`, server actions, or data-hook changes (`useDesigns`, `useFavorites` untouched).
- No changes to `TemplateCard` / `TemplateDetailModal` prop interfaces, the Gallery page, `components/gallery/*`, or `GALLERY_TEMPLATES`.
- No URL syncing of the active tab; no real download tracking (the `downloads: 1` placeholder in `toDisplayItem` is data-shaping, left as-is — see D4).
- No redesign of the Generations content beyond the four widget fixes and the tab wrapper.

### Files in scope (exhaustive)

| Action | File |
|---|---|
| Update | `app/(user)/history/page.tsx` (widget bug fixes + tab structure) |
| Create | `components/history/history-tabs.tsx` (tab switcher UI) |
| Create | `components/history/favorites-section.tsx` (Favorites tab content + empty state) |

No widget components are extracted (they're inline); no other file may be modified.

## Architecture

```
HistoryPage (app/(user)/history/page.tsx)  — "use client"
├─ useDesigns()      → history[] (existing)
├─ useFavorites()    → { isFavorite, toggleFavorite, count }   [consumed]
├─ activeTab state ("generations" | "favorites")
├─ selectedTemplate state (PackagingTemplate | null)  [for modal in Favorites tab]
├─ Header "Your Packaging History" + stat cards (unchanged)
├─ <HistoryTabs active onChange favoritesCount={count} />
├─ activeTab === "generations":
│     ├─ filter bar (unchanged)
│     └─ grid lg:grid-cols-12 → [ design grid (col-9) | sidebar widgets (col-3, FIXED) ]
└─ activeTab === "favorites":
      └─ <FavoritesSection /> (full width)
            ├─ filter GALLERY_TEMPLATES by favoriteIds
            ├─ grid of <TemplateCard onOpen=setSelectedTemplate ... />
            └─ empty state → Link /gallery
      └─ <TemplateDetailModal template={selectedTemplate} onClose=… />
```

The stat cards (Total Designs / Downloads) in the header stay above the tabs (they summarize generations but are harmless and already correct at 0). Tabs sit directly below the header block, above the filter bar / content.

## Data Models

No data models change. Derived values used by the fixes (all from existing `history`):

| Value | Definition | Empty behavior |
|---|---|---|
| `hasDesigns` | `history.length > 0` | gates every widget's real content |
| `recentDownloads` | first up-to-2 `history` items (placeholder until real tracking) | empty → "No recent downloads" |
| `lastGenerated` | `history[0]` | undefined → "No designs yet" |
| `creditsUsedThisWeek` | `history.reduce((s,d)=>s+d.credits,0)` | `0` |
| `creditsBarPct` | `WEEKLY_CREDIT_BASELINE > 0 ? min(100, round(credits / WEEKLY_CREDIT_BASELINE * 100)) : 0` | `0%` |
| `favoriteType` | most-frequent `type` across `history` (or simply `history[0].type` if a true mode is out of scope) | undefined → no type shown |

> `WEEKLY_CREDIT_BASELINE` is a small local constant replacing the hardcoded 60% (e.g. a nominal weekly budget). The key guarantee is `credits === 0 ⇒ 0%` (Property 4). Implementation may also just compute against `totalDesigns`-derived max; the only hard requirement is zero-at-zero and a bounded [0,100] result.

## Components and Interfaces

### `HistoryTabs` — `components/history/history-tabs.tsx` (new)

```ts
export type HistoryTab = "generations" | "favorites";

interface HistoryTabsProps {
  active: HistoryTab;
  onChange: (tab: HistoryTab) => void;
  favoritesCount: number;
}
```

- Two tab buttons in a row over a bottom border (`border-b border-[#E5E4E0]`).
- Active: `text-[#F97316]` + a 2px amber underline (`border-b-2 border-[#F97316]`, offset to overlap the container border). Inactive: `text-[#737373]`, no underline. `transition-all duration-300 ease-out`.
- Favorites label: `Favorites ({favoritesCount})` when `> 0`, else `Favorites`.

### `FavoritesSection` — `components/history/favorites-section.tsx` (new)

```ts
interface FavoritesSectionProps {
  onOpenTemplate: (template: PackagingTemplate) => void;
}
```

- Calls `useFavorites()`; derives `favorites = GALLERY_TEMPLATES.filter(t => favoriteIds.has(t.id))` (memoized).
- **Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px]` of `<TemplateCard template isFavorite={true} onToggleFavorite={toggleFavorite} onOpen={onOpenTemplate} />`. `isFavorite` is always true here, so clicking the heart unfavorites and the item drops from the derived list on next render.
- **Empty state** (`count === 0` / no matches): centered lucide `Heart` (~48px / `w-12 h-12`, muted `text-[#A3A3A3]`), heading "No favorites yet", subtext "Browse the gallery to save templates you like.", amber "Browse Gallery" button → `Link href="/gallery"`.
- Modal ownership: the page owns `selectedTemplate` + renders `<TemplateDetailModal>`, and passes `onOpenTemplate={setSelectedTemplate}` here (keeps a single modal instance and avoids the section needing its own modal state). The heart's `stopPropagation` (already in `TemplateCard`) prevents opening the modal when unfavoriting.

### `HistoryPage` (updated)

- Add `const [activeTab, setActiveTab] = useState<HistoryTab>("generations")`, `const { count } = useFavorites()`, and `const [selectedTemplate, setSelectedTemplate] = useState<PackagingTemplate | null>(null)`.
- Insert `<HistoryTabs ... />` below the header.
- Wrap the existing filter bar + `grid lg:grid-cols-12` (design grid + sidebar) so it renders only when `activeTab === "generations"`.
- Render `<FavoritesSection onOpenTemplate={setSelectedTemplate} />` + `<TemplateDetailModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />` when `activeTab === "favorites"`.
- Apply the four widget fixes (below) within the sidebar markup.

## Bug-Fix Design (rendering layer)

**Recent Downloads** — replace the two always-rendered rows with: if `recentDownloads.length === 0`, an empty state (small `Download`/`Package` icon + muted "No recent downloads"); else map over `recentDownloads` rendering name + `getRelativeTime(timestamp)` (now only called with a real timestamp, so no Invalid Date).

**Last Generated** — if `!lastGenerated`, render muted "No designs yet" + helper text "Generate one to get started" (no enabled View button); else render name + `type • date` and a "View Design" button wired to `lastGenerated.id`.

**Favorite Type** — if `!hasDesigns`, render muted "Generate designs to see your most used type" with **no** type name; else render the computed favorite type + "Most used type". Removes the `?? "Standing Pouch"` fallback.

**This Week** — replace `width: '60%'` with `width: \`${creditsBarPct}%\``, where `creditsBarPct` is `0` when `creditsUsedThisWeek === 0` and otherwise a bounded [0,100] percentage. The "Designs Created" line stays (already correct: shows `totalDesigns`).

`getRelativeTime` is not modified (it's only ever called with a real timestamp after the fix); optionally it could guard `NaN`, but the rendering-layer guard is the chosen fix to keep scope minimal. (See D2.)

## Key Design Decisions

**D1 — Fix at the rendering layer, widgets stay inline.** All four widgets are inline in `page.tsx` and there are no separate widget files. Per the constraints, fixes are conditional rendering in-place; no extraction, no data-hook edits. This keeps the diff localized and the "Generations content functionally unchanged" guarantee (same widgets, correct empty states).

**D2 — Guard at call sites, not inside `getRelativeTime`.** The Invalid Date stems from calling the formatter with `undefined`. Rather than change the formatter (shared-ish utility), the Recent Downloads widget only renders rows for real items, so the formatter always receives a valid timestamp. Minimal, and avoids touching a function other code may rely on.

**D3 — Single modal instance owned by the page.** Both the section grid and the modal need to coordinate; the page owns `selectedTemplate` and renders one `<TemplateDetailModal>`, passing an `onOpenTemplate` callback into `FavoritesSection`. Avoids duplicate modal state and keeps `TemplateDetailModal`'s interface untouched.

**D4 — `downloads`/`recentDownloads` remain placeholders.** Real download tracking is out of scope (no backend). The fix only ensures the widget shows a clean empty state at 0 designs rather than fabricated rows; with designs present it keeps today's placeholder behavior. Noted as future work.

**D5 — Tab switch is local state, sidebar gated by tab.** `activeTab` drives which branch renders. The sidebar (col-3) lives inside the Generations branch, so it's automatically absent on Favorites (which uses full width). No URL sync per the brief.

## Correctness Properties

### Property 1: No fabricated content at zero designs
When `history.length === 0`, none of the four widgets renders a date, a packaging-type name, a design name, or a non-zero bar fill; each shows its muted empty state.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: No Invalid Date
`getRelativeTime` is only invoked with a defined timestamp from a real `history` item, so the string "Invalid Date" can never render.

**Validates: Requirements 1.1**

### Property 3: Bar fill is zero at zero credits and bounded
`creditsBarPct === 0` when `creditsUsedThisWeek === 0`, and `0 <= creditsBarPct <= 100` always.

**Validates: Requirements 1.4**

### Property 4: Generations content preserved
With designs present and the Generations tab active, the page renders the same filter bar, design grid, and sidebar widgets as before (now with correct values), and the sidebar is present.

**Validates: Requirements 2.2, 4.2**

### Property 5: Favorites view = filtered dataset
The Favorites grid shows exactly the `GALLERY_TEMPLATES` whose id is in `favoriteIds` — no extras, no omissions; ids not present in the dataset contribute no card.

**Validates: Requirements 3.2, 3.3**

### Property 6: Immediate removal on unfavorite
Unfavoriting a template while on the Favorites tab removes its card on the next render (derived list recomputes from `favoriteIds`).

**Validates: Requirements 3.5**

### Property 7: Tab/sidebar exclusivity
The sidebar widgets render iff `activeTab === "generations"`; the Favorites grid renders iff `activeTab === "favorites"`. Exactly one content branch is visible.

**Validates: Requirements 4.1, 4.2**

### Property 8: Count badge integrity
The Favorites tab shows `Favorites (n)` with `n === count === favoriteIds.size` when `n > 0`, and plain `Favorites` when `n === 0`.

**Validates: Requirements 2.4**

## Error Handling

- **Zero designs** — every widget guards on `history.length`/`history[0]`; no undefined access reaches a formatter or navigation handler.
- **Stale favorite ids** (id in storage but removed from `GALLERY_TEMPLATES`) — the filter yields no card; harmless.
- **Empty favorites** — `FavoritesSection` renders its empty state; no grid, no modal.
- **No async added** — the bug fixes and tab logic are synchronous; the existing `useDesigns` loading/skeleton path is unchanged.

## Testing Strategy

- **Widget unit/render** — at 0 designs: Recent Downloads shows "No recent downloads" (no Invalid Date), Last Generated shows "No designs yet" + no enabled View button, Favorite Type shows the guidance text with no type name, This Week bar width is `0%`. With ≥1 design: real values render and the bar is a bounded non-zero percentage.
- **`creditsBarPct`** — table check: 0 → 0%; positive → clamped [0,100].
- **`HistoryTabs`** — active tab styled (amber + underline), inactive muted; badge shows only when count > 0.
- **`FavoritesSection`** — empty state at count 0; grid of the correct cards otherwise; unfavoriting drops a card; clicking a card calls `onOpenTemplate`.
- **Integration** — switching to Favorites hides the sidebar and shows the grid; switching back restores the Generations layout; Generations search/filter state persists across switches (component stays mounted).
- **Build gate** — `npx tsc --noEmit` and `npm run build` must pass. No test runner configured; build/typecheck is the minimum gate.

## Known Trade-offs / Future Work

- **Download tracking** is still a placeholder (`downloads: 1`); Recent Downloads is therefore a best-effort widget — the fix only removes the broken zero-state. Real tracking is a future, backend-coupled PR.
- **"Favorite type"** uses a simple computation over loaded designs; a true server-side aggregate would be more accurate (future).
- **Same-tab favorites sync** — `useFavorites()` syncs across tabs via `storage`; within one tab the Gallery and History favorites stay consistent on mount (they're different routes). No shared store needed here.

## Constraints Honored

- No `/api/`, server actions, or auth/credit hooks; no data-hook (`useDesigns`/`useFavorites`) edits.
- `TemplateCard` / `TemplateDetailModal` prop interfaces unchanged; reused as-is.
- `useFavorites()` and `GALLERY_TEMPLATES` consumed, not modified; Gallery page and `components/gallery/*` untouched.
- Bug fixes are rendering-layer only; `getRelativeTime` not modified.
- Active tab = amber text + 2px amber underline; inactive muted; `transition-all duration-300 ease-out`.
- Favorites grid = 4/2/1 responsive, 14px gap; empty-state CTA via `Link` to `/gallery`.
- Tokens limited to the approved palette; lucide `Heart` (non-AI icon).
