# Design — Gallery Card Redesign (hover overlay, detail modal, persistent favorites)

## Overview

Redesign the Gallery template cards to add a hover-reveal info overlay and a click-through **Template Detail modal**, and make favorites persistent. The card preview keeps the **gradient + silhouette** visual base (no placeholder photos), but the silhouette is differentiated per `packagingType` using the already-shared packaging icons. The `PackagingTemplate` data shape expands to carry style tags, a creative description, and a color palette (gradients are kept). Three coordinated changes: (1) per-type silhouette on the gradient card, (2) bottom hover overlay, (3) detail modal — plus a persistent `useFavorites()` hook.

Frontend-only: hardcoded data, `Link` to `/generate`. No backend, `/api/`, or server actions, and no `next/image` / remote-host configuration.

## Current State (ground truth)

Verified against the codebase:

| Item | Reality | Implication |
|---|---|---|
| `PackagingTemplate` | `{ id, name, packagingType, badge?, usageCount, gradientFrom, gradientTo, createdAt }` | Add `styleTags`, `description`, `colorPalette`; **keep** `gradientFrom`/`gradientTo` and `createdAt` |
| `TemplateCard` | gradient bg + per-type silhouette (from shared icons) + footer below image; heart + badge present with `stopPropagation` on heart | Refactor: keep gradient + silhouette, remove footer, add hover overlay + open-on-click; **no images** |
| `components/icons/packaging-icons.tsx` | **Already exists** — 6 distinct silhouettes (`StandingPouchIcon`…`SachetIcon`) + `PACKAGING_ICONS` map | Reused by the card; **no need to create or change it** (the prior extraction PR already did this) |
| `packaging-type-selector.tsx` | **Already imports** the shared icons | **No change needed** — selector already uses the shared file |
| Gallery `page.tsx` | favorites via local `useState<Set<string>>(new Set())` + local `toggleFavorite`; sorts by `usageCount`/`createdAt`; renders `<TemplateCard>` in a grid | Replace local favorites with `useFavorites()`; add `selectedTemplate` modal state + handlers |
| `useFavorites()` hook | **Does NOT exist** | **This PR creates it** (`lib/use-favorites.ts`) with `localStorage` persistence + cross-tab sync (D2) |
| `next.config.ts` | only Google image hosts | **Unchanged** — no `picsum.photos` / images needed |
| `createdAt` usage | Gallery "Newest" sort reads `template.createdAt` | Must remain on the type (D1) |

> **Note on already-completed work:** an earlier PR already extracted the 6 silhouettes into `components/icons/packaging-icons.tsx` and switched `packaging-type-selector.tsx` to import them. So the "extract icons + update selector" part of this adjustment is **already done**; this spec only *consumes* the shared icons in the card and does not re-create or re-edit those two files. They are therefore listed as "no change" rather than in the edit scope.

## Goals

- Keep the gradient (`gradientFrom`→`gradientTo`) card preview; render a **per-`packagingType` silhouette** on it, sized ~55–60% of preview height, white stroke, `strokeWidth={2}`.
- Always-visible heart (top-right) + POPULAR/NEW badge (top-left); name + style-tag pills hidden until hover.
- Hover: card lifts (`-translate-y-1` + `shadow-lg`); bottom overlay slides up (dark gradient backdrop, frosted tag pills).
- Click card body → Template Detail modal (gradient+silhouette preview + name + type pill + description + style pills + color swatches + "Use This Template" → `/generate`).
- Modal: backdrop + scale-in, close via X / backdrop / Escape, body scroll lock.
- Expanded `PackagingTemplate` with `styleTags`, `description`, `colorPalette` populated for all 14 entries (gradients kept).
- A `useFavorites()` hook persisting favorites to `localStorage` (SSR-safe, cross-tab sync), used by the Gallery in place of local state.

## Non-Goals

- No backend, `/api/`, or server actions; data stays hardcoded.
- **No placeholder/real images** on cards or in the modal — gradient + silhouette only. No `next/image`, no `picsum.photos`, no `next.config.ts` change, no image load/error handling.
- No template→Generate propagation; "Use This Template" just navigates to `/generate`.
- **No History page changes** — the Favorites tab on History is a separate, deferred PR. This PR does NOT touch `app/(user)/history/page.tsx` or create any `components/history/*` files.
- **No changes to `components/icons/packaging-icons.tsx` or `packaging-type-selector.tsx`** — the shared icons already exist and the selector already imports them.
- No changes to filtering/sorting/pagination logic, the Generate page, or any other component.

### Files in scope (exhaustive)

| Action | File |
|---|---|
| Create | `lib/use-favorites.ts` (persistent favorites hook) |
| Create | `components/gallery/template-detail-modal.tsx` |
| Update | `lib/gallery-templates.ts` (add `styleTags`/`description`/`colorPalette`; keep gradients + `createdAt`) |
| Update | `components/gallery/template-card.tsx` (gradient + per-type silhouette; hover overlay; open-on-click) |
| Update | `app/(user)/gallery/page.tsx` (favorites hook + modal state/handlers) |

`components/icons/packaging-icons.tsx` and `components/generation/packaging-type-selector.tsx` are **consumed but already exist/already wired** — not modified by this PR. No other file may be modified.

## Architecture

```
Gallery page (app/(user)/gallery/page.tsx)  — "use client"
├─ useFavorites()  → { isFavorite, toggleFavorite }   [new hook, localStorage-backed]
├─ existing search / filter / sort / paginate (unchanged)
├─ grid → <TemplateCard onOpen={setSelectedTemplate} isFavorite onToggleFavorite ... />   [refactored]
│     ├─ gradient preview (gradientFrom→gradientTo) + per-type silhouette (white, strokeWidth 2, ~55–60% height)
│     ├─ heart (top-right, always; stopPropagation)
│     ├─ badge (top-left, conditional)
│     └─ hover overlay (absolute bottom: name + frosted tag pills)
└─ <TemplateDetailModal template={selectedTemplate} onClose=… />   [new]
      ├─ backdrop (black/60, blur, click-to-close)
      └─ container (max-w 900, 85vh, scale-in)
            ├─ left ~60%: gradient + large silhouette preview
            └─ right ~40%: name · type pill · description · style pills · color swatches · "Use This Template" → Link /generate

Hook:    lib/use-favorites.ts  (Set<string> + localStorage "kemas-favorite-templates" + storage-event sync)
Data:    lib/gallery-templates.ts  (PackagingTemplate + GALLERY_TEMPLATES, expanded; gradients kept)
Shared:  components/icons/packaging-icons.tsx  (already exists — consumed by card; unchanged)
```

Rendering flow: the page owns `selectedTemplate` and reads favorites from `useFavorites()`; cards open the modal on body click; the modal (mounted only when non-null) owns its own scroll-lock + Escape effects. No images are loaded — previews are CSS gradients with vector silhouettes.

## Data Models

### Final `PackagingTemplate` (`lib/gallery-templates.ts`)

```ts
export interface PackagingTemplate {
  id: string;
  name: string;
  packagingType: GalleryPackagingType;
  gradientFrom: string;      // KEPT — card preview gradient start
  gradientTo: string;        // KEPT — card preview gradient end
  styleTags: string[];       // NEW — 2–3 mood words
  description: string;       // NEW — 2–3 sentence creative brief
  colorPalette: string[];    // NEW — 4–6 hex values
  badge?: TemplateBadge;
  usageCount: number;
  createdAt: string;         // KEPT — drives the "Newest" sort (see D1)
}
```

No fields are removed. `imageUrl` and `fallbackGradient` are **not** added (image approach reverted).

**Card preview:** the existing `gradientFrom`→`gradientTo` linear gradient fills the 4:5 area; a per-`packagingType` silhouette from `components/icons/packaging-icons.tsx` is centered on top (white stroke, `strokeWidth={2}`, ~55–60% of preview height).

**Style tag vocabulary:** elegant, modern, bold, spicy, traditional, warm, premium, playful, rustic, minimal, vibrant (2–3 per template, mood-matched).

**Color palette:** 4–6 hex values per template matching its mood (decorative swatches — free hex, not restricted to brand tokens).

### Favorites persistence shape (`lib/use-favorites.ts`)

```
localStorage key: "kemas-favorite-templates"
value: JSON string array of template ids, e.g. ["keripik-singkong-premium","bakpia-klasik"]
in-memory: Set<string>
```

## Components and Interfaces

### `useFavorites` — `lib/use-favorites.ts` (new)

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
- **SSR-safe init:** `useState<Set<string>>(new Set())` — server and first client render both start empty (no `localStorage` access during render), avoiding hydration mismatch.
- **Hydrate on mount:** a `useEffect` reads `localStorage[FAVORITES_STORAGE_KEY]`, JSON-parses to a string array, validates it is an array of strings, and sets the set. Wrapped in try/catch — on parse error or invalid shape, fall back to an empty set.
- **Persist on change:** a `useEffect` keyed on the set writes `JSON.stringify([...set])`. A `hydrated` ref gates writes so the initial empty set never clobbers stored data before hydration completes.
- **Cross-tab sync:** a `useEffect` adds a `window` `storage` listener; when `e.key === FAVORITES_STORAGE_KEY` it re-parses `e.newValue` into the set (try/catch guarded). Removed on unmount.
- **API:** `toggleFavorite(id)` clones the set (add if absent, remove if present); `isFavorite(id)` = `has(id)`; `count` = `size`. All `window`/`localStorage` access is `typeof window !== "undefined"` guarded.

### `TemplateCard` — `components/gallery/template-card.tsx` (refactor)

Props unchanged in spirit, plus an open handler:

```ts
interface TemplateCardProps {
  template: PackagingTemplate;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (template: PackagingTemplate) => void;   // NEW — click card body
}
```

Structure:
- **Root**: `group relative bg-white border border-[#E5E4E0] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg`. `onClick={() => onOpen(template)}`; add `role="button"`, `tabIndex={0}`, and Enter/Space key handler for a11y.
- **Preview area**: `relative aspect-[4/5]` with an inline `backgroundImage: linear-gradient(to bottom right, gradientFrom, gradientTo)`; a centered per-`packagingType` silhouette from `components/icons/packaging-icons.tsx` (`PACKAGING_ICONS[type]` or direct import), `text-white`, `strokeWidth={2}`, sized ~55–60% of preview height (e.g. `h-[58%] w-auto`). No `next/image`, no image load/error logic.
- **Heart** (top-right, always visible): unchanged behavior — `e.stopPropagation()` then `onToggleFavorite(id)`; filled amber when favorite, white outline otherwise.
- **Badge** (top-left, conditional): POPULAR (white pill, amber `Zap`) / NEW (solid amber pill).
- **Hover overlay** (absolute, bottom, full width): `bg-gradient-to-t from-black/80 via-black/40 to-transparent`, padding `12px`. Hidden by default `translate-y-full opacity-0`, shown on group hover `group-hover:translate-y-0 group-hover:opacity-100`, `transition-all duration-300 ease-out`. Content: name (`text-white font-medium text-[13px]`) + a row of frosted tag pills (`bg-white/15 backdrop-blur-sm text-white border border-white/20 px-2 py-0.5 rounded-full text-[10px]`).
- The old footer (name/type below the preview) is removed.

### `TemplateDetailModal` — `components/gallery/template-detail-modal.tsx` (new)

```ts
interface TemplateDetailModalProps {
  template: PackagingTemplate | null;   // null = closed
  onClose: () => void;
}
```

- Returns `null` when `template` is null.
- **Backdrop**: `fixed inset-0 z-50 bg-black/60 backdrop-blur-sm` + fade-in; `onClick={onClose}`.
- **Container**: centered, `max-w-[900px] w-full max-h-[85vh] bg-white rounded-2xl overflow-hidden` with a scale-up entrance; `onClick` stops propagation so inner clicks don't close. Two columns (`flex`, stacks on mobile): left ~60% image, right ~40% info (`p-6`, scrollable).
- **Close (X)**: top-right, neutral hover (`hover:bg-[#E5E4E0]`).
- **Left**: gradient preview (`gradientFrom`→`gradientTo`) filling the content height with a large centered silhouette for the template's `packagingType` (white, `strokeWidth={2}`). No image.
- **Right**: name (`text-[22px] font-bold text-[#1A1A1A]`); packaging-type pill below (reusing `packagingTypeLabel`); **Description** section (`description`); **Styles** section — same tags as larger amber-bordered pills (`border border-[#F97316]/40 text-[#F97316] bg-[#F97316]/10`); **Colors** section — 4–6 `28px` filled circles (`w-7 h-7 rounded-full` with inline `backgroundColor`); bottom full-width amber "Use This Template" button with `ArrowRight`, implemented as `Link href="/generate"`.
- **Effects (inside the modal, runs only while open):**
  - **Scroll lock**: `useEffect` sets `document.body.style.overflow = "hidden"` on mount, resets on cleanup.
  - **Escape**: `useEffect` adds a `keydown` listener calling `onClose` on `Escape`; removed on cleanup.
  - Both guarded so they only attach when a template is open.

### Gallery page (`app/(user)/gallery/page.tsx`) changes

- Replace the local favorites state — remove `const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())` and the local `toggleFavorite` — with `const { isFavorite, toggleFavorite } = useFavorites()`.
- Pass `isFavorite={isFavorite(template.id)}` and `onToggleFavorite={toggleFavorite}` to each `TemplateCard` (the card's prop interface is unchanged).
- Add `const [selectedTemplate, setSelectedTemplate] = useState<PackagingTemplate | null>(null)`; pass `onOpen={setSelectedTemplate}` to each `TemplateCard`.
- Render `<TemplateDetailModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />` once, after the grid.
- Sort/filter/paginate untouched. Remove the unused `useState` import only if nothing else uses it.

## Behavior / Logic

- **Card click vs heart**: card root `onClick` opens the modal; the heart button calls `e.stopPropagation()` first, so favoriting never opens the modal.
- **Hover**: only `group-hover` drives the overlay + lift; non-hover shows the clean gradient + silhouette preview with heart + badge.
- **Modal open/close**: clicking a card sets `selectedTemplate`; X, backdrop click, or Escape sets it to `null`. Inner container stops propagation.
- **Scroll lock** engages while the modal is open and is always restored on close/unmount (cleanup), so it can't leak and freeze the page.
- **Silhouette selection**: the card and modal pick the silhouette from the shared `PACKAGING_ICONS` map by `packagingType`, so all six types render distinctly.

## Key Design Decisions

**D1 — Keep `createdAt`.** The brief's "final shape" omits it, but the Gallery "Newest" sort reads `template.createdAt`. Removing it breaks that sort (out of scope to change). It is retained on the type and all entries; the brief's list is treated as "fields to add" rather than an exhaustive replacement.

**D2 — Build the persistent `useFavorites()` hook in this PR.** The hook was never created by the earlier (unexecuted) favorites-tab spec, so this PR creates `lib/use-favorites.ts` and the Gallery consumes it in place of local `useState`. Persistence (`localStorage` + cross-tab `storage` sync, SSR-safe) is required so favorites survive refresh and navigation — without it the visual redesign loses utility. `TemplateCard`'s prop interface (`isFavorite`, `onToggleFavorite`) is unchanged; only the page's state source changes. The History Favorites tab that would also consume this hook is explicitly deferred to a separate PR.

**D3 — Keep gradient + silhouette previews (image approach reverted).** Random placeholder photos (`picsum.photos`) don't communicate packaging design and look out of place in a packaging gallery. The card and modal previews use the existing per-template CSS gradient with a vector silhouette on top. This drops `imageUrl`, `fallbackGradient`, all `next/image` usage, and the `next.config.ts` remote-host change.

**D4 — Modal owns its own effects.** Scroll lock + Escape live inside `TemplateDetailModal` (mounted only when open) rather than the page, so cleanup is automatic and the page stays simple. Returning `null` when closed means effects only run during an open session.

**D5 — Shared silhouettes already exist; consume, don't re-create.** `components/icons/packaging-icons.tsx` (6 distinct `*Icon` components + `PACKAGING_ICONS` map) and the `packaging-type-selector.tsx` import were created by an earlier PR. This PR only *uses* them in the card (and modal), sized larger with white stroke and `strokeWidth={2}`. Neither file is modified, so they are out of this PR's edit scope.

## Correctness Properties

### Property 1: Heart never opens the modal
Clicking the favorite heart toggles favorite state and does not set `selectedTemplate` (propagation stopped); clicking elsewhere on the card opens the modal.

**Validates: Requirements 3.5, 5.3**

### Property 2: Modal open/close is total
`selectedTemplate` transitions to a template only via a card-body open, and back to `null` via X, backdrop, or Escape; the modal renders iff `selectedTemplate !== null`.

**Validates: Requirements 3.2, 3.3, 3.4**

### Property 3: Scroll lock is balanced
Whenever the modal opens, `document.body.style.overflow` is `"hidden"`; whenever it closes or unmounts, the prior value is restored — no permanent lock.

**Validates: Requirements 3.6**

### Property 4: Overlay visibility is hover-gated
In the non-hover state the name + tag overlay is visually hidden (`opacity-0`, translated off); on hover it is fully shown. Heart and badge are visible in both states.

**Validates: Requirements 2.1, 2.4, 2.5**

### Property 5: Data completeness
Every template in `GALLERY_TEMPLATES` has non-empty `gradientFrom`/`gradientTo`, 2–3 `styleTags`, a non-empty `description`, and 4–6 `colorPalette` hex values.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 6: Silhouette differentiation
Each `packagingType` maps to its own distinct silhouette component via `PACKAGING_ICONS`, so two templates of different types never render the same silhouette.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 7: Modal reflects the selected template
The modal's name, type pill, description, style pills, and color swatches all correspond to `selectedTemplate`'s fields.

**Validates: Requirements 6.2, 6.3, 6.4, 6.5**

### Property 8: Favorites persistence round-trip
After `toggleFavorite(id)` adds an id, the value stored at `FAVORITES_STORAGE_KEY` parses to an array containing that id; a fresh `useFavorites()` mount hydrates a set equal to the stored contents (favorites survive refresh/navigation).

**Validates: Requirements 9.2, 9.3, 9.5**

### Property 9: Favorite toggle is an involution per id
Calling `toggleFavorite(id)` twice returns membership for that id to its prior value and changes membership for no other id.

**Validates: Requirements 9.4**

### Property 10: SSR-safe + parse-resilient favorites
On the server and first client render `favoriteIds` is empty (no `window`/`localStorage` during render); if the stored value is missing, non-JSON, or not a string array, hydration yields an empty set without throwing.

**Validates: Requirements 9.6, 9.7**

## Error Handling

- **Escape / scroll-lock listeners** — attached only while the modal is open and removed on cleanup (Property 3); safe against unmount-during-open.
- **localStorage unavailable / throws** (private mode, quota) — the hook wraps all reads/writes in try/catch and degrades to in-memory-only for the session (no crash); corrupt stored values fall back to an empty set.
- **No async/network** — data is static and previews are CSS gradients + inline SVG (no image loading), so there are no loading/error states for the grid.

## Testing Strategy

- **Data unit** — assert Property 5 across all 14 entries (gradients present, 2–3 tags, description present, 4–6 colors).
- **Component (`TemplateCard`)** — heart click calls `onToggleFavorite` and not `onOpen` (Property 1); card-body click calls `onOpen`; the rendered silhouette matches the template's `packagingType` (Property 6); badge variants render; overlay markup present.
- **Component (`TemplateDetailModal`)** — renders nothing when `template` is null; renders the selected fields when set (Property 7); X/backdrop/Escape invoke `onClose`; sets/restores `body.overflow` (Property 3).
- **Integration (Gallery)** — clicking a card opens the modal; closing returns focus to the grid; favorites still toggle independently and persist across refresh.
- **Build gate** — `npx tsc --noEmit` and `npm run build` must pass. No test runner is configured; if added it would be Vitest + Testing Library, otherwise build/typecheck is the minimum gate.

## Known Trade-offs / Future Work

- **History Favorites tab** — a separate, deferred PR will add a Favorites tab to the History page consuming the same `useFavorites()` hook. Not built here; `app/(user)/history/page.tsx` and `components/history/*` are untouched.
- **Same-tab, two hook instances** — the `storage` event fires only in *other* tabs. Within one tab, components reading `useFavorites()` stay consistent by hydrating from `localStorage` on mount; live cross-instance sync on one screen would need a shared store (future).
- **Template→Generate propagation** is deferred; "Use This Template" only navigates to `/generate`.
- **Stylized previews, not real artwork** — gradient + silhouette is an aesthetic stand-in; real generated packaging imagery for templates is a future enhancement (would reintroduce an image field + host config at that time).
- **Color palette / tags** are hand-authored mock metadata; when real templates exist they'd come from the generation record.

## Constraints Honored

- No backend/`/api/`/server actions; data hardcoded; "Use This Template" via `Link` to `/generate`.
- Favorites persisted via `localStorage` in a new `useFavorites()` hook (D2); `TemplateCard` heart prop interface preserved.
- History page and `components/history/*` untouched (deferred PR).
- `components/icons/packaging-icons.tsx` and `packaging-type-selector.tsx` consumed but not modified (already wired by a prior PR).
- UI chrome uses the approved palette; black overlays/backdrop are decorative and explicitly permitted.
- No images / `next/image` / remote-host config; gradients + silhouettes only.
- Generate page and generation flow untouched; only the 5 in-scope files change.
