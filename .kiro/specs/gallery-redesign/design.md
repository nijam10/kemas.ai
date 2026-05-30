# Design — Gallery Page Redesign

## Overview

Redesign `app/(user)/gallery/page.tsx` to display a curated grid of **Indonesian snack UMKM** packaging templates instead of an API-backed empty state. The page renders from a hardcoded local dataset, supports client-side search / packaging-type filtering / sorting / pagination, and lets users toggle in-memory favorites. Three reusable components are introduced; the hero, search bar, sort bar, grid composition, and CTA stay inline in the page.

This is a **frontend-only** feature: hardcoded data, in-memory state, one route link to `/generate`. No backend, no `/api/`, no auth/credit hooks touched.

## Current State (ground truth)

Verified against the codebase:

| Item | Reality | Implication |
|---|---|---|
| `app/(user)/gallery/page.tsx` | Fully inline; fetches via `useGallery()` → `/api/gallery`; renders Category filter (`Food Beverages`, `Modern Minimal`, …), a Featured block, a preview modal, and a full-width gradient CTA banner | Rewritten end-to-end; Category filter, featured block, modal, and gradient banner all removed |
| `components/gallery/` | **Does not exist** | Created fresh; no existing gallery components to delete |
| `hooks/use-gallery.ts` | Used **only** by the gallery page | Becomes unused after rewrite. It is **out of scope** (not in the file list) and still imports cleanly, so it is left in place (a no-op). Noted under Known Trade-offs. |
| Packaging icons | `packaging-type-selector.tsx` uses lucide-react `Package` / `Box` / `Container` (not custom SVGs) | The card "silhouette" reuses these same lucide icons, enlarged; faithful to the request's intent ("reuse the SVG icons … adapted larger") |
| Brand-gradient icon container | Generate page pattern: `w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#FACC15]` with a white `w-5 h-5` icon | Reused in the hero |

> Note on icons: the request says "reuse the SVG icons from packaging-type-selector.tsx … white-filled with outlined strokes." Those are lucide-react components, which are stroke-based (not fill-based). The card uses the same lucide icons enlarged with a white stroke over the gradient; a literal white *fill* isn't how lucide renders, so we honor the visual intent (large, white, centered silhouette) using strokes. Flagged as Decision D2.

## Goals

- Render ≥12 snack-specific templates in a responsive grid (4 / 2 / 1 columns).
- Client-side search, packaging-type filter, sort, and pagination (12 per page).
- In-memory favorites toggle (no persistence).
- Inline white CTA card linking to `/generate`.
- Reusable `TemplateCard`, `PackagingTypeFilter`, `GalleryPagination` components.
- Match Generate-page interaction feel (`transition-all duration-300 ease-out`, card hover lift, amber active states).

## Non-Goals

- **No backend / API changes.** Nothing under `/api/`, no server actions, no auth/credit hooks. The page no longer calls `useGallery()`.
- **No persistence.** Favorites and all UI state are in-memory only.
- **No Category filter row** (removed — out of scope for snack UMKM).
- No Featured block, no preview modal, no full-width gradient CTA banner (all removed from the old page).
- "Filters" button is decorative (a "Coming soon" toast); no filter panel is built.
- No new routes; the only navigation is a `Link` to `/generate`.

### Files in scope (exhaustive)

| Action | File |
|---|---|
| Create | `lib/gallery-templates.ts` |
| Create | `components/gallery/template-card.tsx` |
| Create | `components/gallery/packaging-type-filter.tsx` |
| Create | `components/gallery/gallery-pagination.tsx` |
| Update | `app/(user)/gallery/page.tsx` |
| Delete | any current gallery component replaced by this work **after** verifying no importers (currently **none** exist) |

No other file may be modified.

## Architecture

### Page composition (top → bottom)

```
GalleryPage (app/(user)/gallery/page.tsx)  — "use client"
├─ AuthNavbar
├─ Hero (inline)                — gradient icon + title + 2-line description
├─ Search + Filters row (inline)— pill search input, decorative "Filters" pill
├─ <PackagingTypeFilter />      — "PACKAGING TYPE" label + 7 chips
├─ Sort + count bar (inline)    — "Showing X templates" + sort dropdown
├─ Template grid (inline)       — maps page slice → <TemplateCard />
├─ <GalleryPagination />        — chevrons + numbered pages
└─ CTA card (inline)            — white bordered card → Link /generate
```

### Data flow

```
GALLERY_TEMPLATES (static)
  → filter by selectedPackagingType + searchQuery
  → sort by sortBy
  → derive totalPages (PAGE_SIZE = 12)
  → slice to currentPage
  → render TemplateCards (favorite state from favoriteIds Set)
```

All derivations are `useMemo`'d in the page. Favorites live in a `Set<string>` state; toggling clones the Set (immutable update).

## Data Models

### `lib/gallery-templates.ts`

```ts
export type GalleryPackagingType =
  | "standing-pouch"
  | "pillow-pouch"
  | "box"
  | "jar"
  | "bottle"
  | "sachet";

export type TemplateBadge = "popular" | "new";

export interface PackagingTemplate {
  id: string;
  name: string;            // Indonesian snack name
  packagingType: GalleryPackagingType;
  badge?: TemplateBadge;   // optional
  usageCount: number;      // 400–1500 (mock)
  gradientFrom: string;    // hex, mood-based
  gradientTo: string;      // hex, mood-based
  createdAt: string;       // ISO; drives "Newest" sort
}

export const GALLERY_TEMPLATES: PackagingTemplate[] = [ /* ≥12 entries */ ];
```

**Template set (≥12, snack UMKM):** Keripik Singkong Premium, Rempeyek Heritage, Kerupuk Pedas Bold, Kue Kering Lebaran, Kacang Garing Snack, Kerupuk Udang Klasik, Oleh-Oleh Premium Box, Pisang Sale Tradisional, Dodol Tradisional, Bakpia Klasik, Sambal Roa Sachet, Manisan Mangga. (14 total so pagination shows 2 pages.)

**Mood → gradient mapping (palette-constrained):**

| Mood | gradientFrom → gradientTo |
|---|---|
| Traditional / warm cream | `#FCFBF7` → `#FACC15` |
| Spicy / terra red | `#F97316` → `#FACC15` |
| Classic / golden | `#FACC15` → `#F97316` |
| Premium / dark | `#1A1A1A` → `#737373` |
| Organic / neutral | `#E5E4E0` → `#FCFBF7` |

> All gradient hex values are drawn from the approved token set. (No new colors introduced.)

### `PACKAGING_TYPE_OPTIONS` (filter source)

A constant list pairing each chip label with its filter value:

```ts
[
  { label: "All Types", value: "all" },      // default
  { label: "Standing Pouch", value: "standing-pouch" },
  { label: "Pillow Pouch", value: "pillow-pouch" },
  { label: "Box", value: "box" },
  { label: "Jar", value: "jar" },
  { label: "Bottle", value: "bottle" },
  { label: "Sachet", value: "sachet" },
]
```

This lives in `packaging-type-filter.tsx` (its presentational concern) and the human-readable label mapping is reused by `TemplateCard` for the metadata row.

## Components and Interfaces

### `TemplateCard` — `components/gallery/template-card.tsx`

```ts
interface TemplateCardProps {
  template: PackagingTemplate;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}
```

- Root: `group bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md`.
- **Preview area**: `aspect-[4/5]` with inline `background-image: linear-gradient(to bottom right, gradientFrom, gradientTo)` (inline style because hex values are dynamic per template). Centered lucide silhouette icon (`Package` / `Box` / `Container` chosen by `packagingType`), large (`w-16 h-16`) with white stroke (`text-white`).
- **Badge** (top-left, conditional):
  - `popular` → white pill, amber text + `Zap` icon: `bg-white text-[#F97316]`, label "POPULAR".
  - `new` → solid amber pill, white text: `bg-[#F97316] text-white`, label "NEW".
- **Heart button** (top-right): `Heart` icon; default outline (`text-white`), active filled amber (`fill-[#F97316] text-[#F97316]`). Calls `onToggleFavorite(template.id)`, `stopPropagation` so it never triggers card-level nav. `aria-pressed={isFavorite}`, `aria-label`.
- **Footer**: name (`text-xs font-medium text-[#1A1A1A]`, 12px) + metadata row `{packagingType label} · {usageCount} uses` (`text-xs text-[#737373]`).

### `PackagingTypeFilter` — `components/gallery/packaging-type-filter.tsx`

```ts
interface PackagingTypeFilterProps {
  selected: string;                 // "all" | GalleryPackagingType
  onSelect: (value: string) => void;
}
```

- Small uppercase label "PACKAGING TYPE" (`text-xs font-semibold tracking-wide text-[#A3A3A3]`).
- Pill chips from `PACKAGING_TYPE_OPTIONS`. Active: `bg-[#F97316] text-white`. Inactive: `bg-white border border-[#E5E4E0] text-[#737373] hover:border-[#F97316]/70 hover:text-[#1A1A1A]`. All `transition-all duration-300 ease-out`.
- Also exports `PACKAGING_TYPE_OPTIONS` and a `packagingTypeLabel(value)` helper consumed by the page/card.

### `GalleryPagination` — `components/gallery/gallery-pagination.tsx`

```ts
interface GalleryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

- Centered row: `ChevronLeft` button, numbered page buttons `1..totalPages`, `ChevronRight` button.
- Current page: `bg-[#F97316] text-white`. Others: `bg-white border border-[#E5E4E0] text-[#737373] hover:border-[#F97316]/70`.
- Chevrons disabled (`opacity-40 cursor-not-allowed`) at the first/last page. Renders nothing when `totalPages <= 1`.
- (Request mentions "1, 2, 3, …, 8"; with 14 templates / 12 per page there are 2 pages, so all numbers render directly — no ellipsis logic needed. Component renders `totalPages` buttons generically.)

### `GalleryPage` (inline) state

| State | Type | Default |
|---|---|---|
| `searchQuery` | `string` | `""` |
| `selectedPackagingType` | `string` | `"all"` |
| `sortBy` | `"popular" \| "newest" \| "most-used"` | `"popular"` |
| `currentPage` | `number` | `1` |
| `favoriteIds` | `Set<string>` | `new Set()` |
| `sortMenuOpen` | `boolean` | `false` (dropdown open/close) |

Derived (memoized): `filtered` → `sorted` → `totalPages` → `pageSlice`.

## Behavior / Logic

- **Search**: case-insensitive match against `name` and the human-readable `packagingType` label (covers "by name, style, or color" pragmatically against available fields).
- **Packaging filter**: `selectedPackagingType === "all"` shows all; else exact match on `template.packagingType`.
- **Sort**: `popular` → `usageCount` desc then `badge==="popular"` first; `newest` → `createdAt` desc; `most-used` → `usageCount` desc.
- **Pagination**: `PAGE_SIZE = 12`; `totalPages = max(1, ceil(filtered.length / 12))`; slice `(currentPage-1)*12 .. currentPage*12`.
- **Reset to page 1** whenever `searchQuery`, `selectedPackagingType`, or `sortBy` changes (guard against landing on an out-of-range page).
- **Favorites**: toggle adds/removes the id in a cloned `Set`; affects only the heart icon fill.
- **"Filters" button & sort selection**: "Filters" shows a "Coming soon" toast via the existing `useToast` hook (already in `hooks/use-toast.ts`); choosing a sort option updates `sortBy` and closes the menu.

## Key Design Decisions

**D1 — Local hardcoded data, page stops calling `useGallery()`.** The request mandates hardcoded templates and no backend. The page imports `GALLERY_TEMPLATES` directly and drops `useGallery()`. `hooks/use-gallery.ts` is left untouched (out of scope, still compiles) — see Known Trade-offs.

**D2 — lucide icons as the "silhouette."** `packaging-type-selector.tsx` uses lucide `Package`/`Box`/`Container` (stroke-based), not fillable SVG paths. The card reuses these enlarged with a white stroke over the mood gradient, honoring the visual intent without a literal fill.

**D3 — Inline gradient style.** Per-template gradient hex values can't be Tailwind classes (dynamic), so the preview uses an inline `style={{ backgroundImage: ... }}`. Palette remains constrained to approved tokens.

**D4 — Decorative "Filters" + toast.** Reuse the existing `useToast` hook rather than adding a new dependency; the button is purely indicative.

## Correctness Properties

### Property 1: Pagination slice is bounded and complete
For any filter/sort state, the rendered slice has at most `PAGE_SIZE` (12) items, and concatenating all pages in order reproduces the full filtered+sorted list with no duplicates or omissions.

**Validates: Requirements 6.1, 6.2, 6.4**

### Property 2: Current page always in range
`1 <= currentPage <= totalPages` holds at all times; whenever the filtered set changes such that `currentPage > totalPages`, the page resets so the user never sees an empty in-range page.

**Validates: Requirements 6.3, 2.4, 3.4, 5.4**

### Property 3: Filter correctness
When `selectedPackagingType !== "all"`, every displayed template has `packagingType === selectedPackagingType`; when `"all"`, no template is excluded by the type filter.

**Validates: Requirements 3.2, 3.3**

### Property 4: Search correctness
Every displayed template matches the (case-insensitive) `searchQuery` against its name or packaging-type label; an empty query excludes nothing.

**Validates: Requirements 2.2, 2.3**

### Property 5: Sort ordering
The sorted list is monotonic under the active key (`most-used`/`popular`: non-increasing `usageCount`; `newest`: non-increasing `createdAt`).

**Validates: Requirements 5.2, 5.3**

### Property 6: Favorite toggle is an involution
Toggling the same template id twice returns `favoriteIds` to its prior membership for that id; toggling affects exactly one id and no other.

**Validates: Requirements 7.2, 7.3**

### Property 7: Count integrity
The "Showing X templates" count equals the length of the filtered list (pre-pagination), not the page slice.

**Validates: Requirements 5.1**

## Error Handling

- **No async / no I/O** — data is static and synchronous, so there are no network/loading/error states (the old skeleton + error path are removed).
- **Empty results** — when the filtered list is empty, the grid is replaced by an inline empty state ("No templates found" + hint), and pagination renders nothing (`totalPages` clamps to 1, but the empty state takes precedence over rendering cards).
- **Out-of-range page** — guarded by the page-reset effect (Property 2); `pageSlice` of an out-of-range page would be empty, but the reset prevents it.
- **Favorites** — pure in-memory Set operations; cannot throw.

## Testing Strategy

- **Unit (pure helpers)** — extract filter/sort/paginate as pure functions (or test via the memo logic) and assert the cost-free correctness properties: slice bound + completeness (P1), filter (P3), search (P4), sort monotonicity (P5), count integrity (P7), favorite involution (P6).
- **Component** — `TemplateCard` renders badge variants and toggles favorite via callback; `PackagingTypeFilter` marks exactly one active chip and emits the selected value; `GalleryPagination` disables chevrons at bounds and highlights the current page, renders nothing for `totalPages <= 1`.
- **Integration** — changing filter/sort resets to page 1; "Showing X" reflects filtered length; navigating pages changes the visible slice.
- **Build gate** — `npm run build` and `npx tsc --noEmit` must pass (project rules). No test runner is currently configured; if added it would be Vitest, otherwise the build/typecheck is the minimum gate.

## Known Trade-offs / Future Work

- **`hooks/use-gallery.ts` becomes unused.** After this redesign the page no longer calls it. It is **out of scope** (not in the file list) and still compiles (its import of `getGalleryTemplates` is intact), so it is left as a harmless no-op rather than deleted. A future cleanup PR can remove it (and optionally the `/api/gallery` route + `getGalleryTemplates` client) once confirmed unused project-wide.
- **Templates are mock/hardcoded.** "Use template" deep-linking and real preview images are out of scope; cards are visual/aesthetic references only in this PR. A future PR can wire templates to the generator and to persistent favorites.
- **Search scope** is limited to name + packaging-type label (no separate "style/color" fields exist on the model); the placeholder text is aspirational for when richer fields are added.

## Constraints Honored

- Tokens limited to `#F97316`, `#FACC15`, `#FCFBF7`, `#E5E4E0`, `#1A1A1A`, `#737373`, `#A3A3A3`.
- Grid: 4 (desktop) / 2 (tablet) / 1 (mobile), 14px gap.
- Interaction feel matches Generate: `transition-all duration-300 ease-out`; card hover `-translate-y-0.5` + `shadow-md`; active = 2px amber border / 10% amber tint / amber text (chips use solid amber + white per the request).
- No AI-themed icons; snack-only template content; no "4K" claims.
- No `/api/`, server action, or auth/credit hook touched; favorites in-memory; CTA via `Link` to `/generate`.
