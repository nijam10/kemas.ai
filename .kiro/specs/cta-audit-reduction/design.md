# Design — CTA Audit & Reduction

## Overview

Reduce repetitive "Start Generating" / "Generate" CTAs across the app. The same generic message appears in several places, weakening its impact and duplicating the top-nav "Generate" tab. This PR is a **pure copy + visual-prominence change**: no logic, no new components, no routing/backend changes. It removes one redundant CTA card, varies generic empty-state copy to be page-specific, and downgrades over-prominent empty-state buttons to a gentler outlined style.

## Audit — every generation CTA instance found

Searched for `Start Generating`, `Generate Design`, `Generate from Scratch`, `Generate your`, `Start with a template`, and `/generate` links across the codebase (excluding `z/` docs and `.kiro/specs/`). Complete inventory:

| # | File | Location / context | Current text | Category |
|---|---|---|---|---|
| 1 | `components/layout/*` (top nav) | "Generate" nav tab | "Generate" | **KEEP** (canonical) |
| 2 | `app/(user)/generate/page.tsx` ~L139 | primary submit button | "Generate Design · {N} credits" | **KEEP** (canonical, constraint) |
| 3 | `components/gallery/template-detail-modal.tsx` | modal CTA | "Use This Template" | **KEEP** (contextual) |
| 4 | `components/history/favorites-section.tsx` | favorites empty state | "Browse Gallery" | **KEEP** (contextual) |
| 5 | `app/(user)/gallery/page.tsx` ~L251–267 | bottom inline CTA card ("Can't find what you're looking for?" + "Generate from Scratch") | "Generate from Scratch" | **REMOVE** (redundant card) |
| 6 | `app/(user)/history/page.tsx` ~L268–273 | main design empty-state button | "Start Generating" | **VARY + DOWNGRADE** → "Generate your first design", outlined |
| 7 | `app/(user)/dashboard/page.tsx` ~L173–176 | recent-designs empty-state button | "Start Generating" | **VARY + DOWNGRADE** → "Generate your first design", outlined |
| 8 | `app/about/page.tsx` ~L127 (hero secondary) | secondary link, already white/outlined-ish | "Start Generating" | **VARY** → "Generate your first design" (copy only; see D3) |
| 9 | `app/about/page.tsx` ~L588 (closing CTA) | large filled-amber link | "Start Generating" | **VARY** → "Generate your first design" (copy only; see D3) |
| 10 | `components/ui/empty-state.tsx` `EmptyHistory()` | reusable empty state | "Start Generating" | **OUT OF SCOPE (D4)** — dead code, not shipped; left untouched |
| 11 | `components/ui/empty-state.tsx` `EmptyGallery()` | reusable empty state | "Create First Design" | leave (already specific, not "Start Generating") |
| 12 | `components/ui/empty-state.tsx` `EmptyDashboard()` | reusable empty state | "Create Your First Design" | leave (already specific) |
| 13 | `app/(user)/history/page.tsx` (Favorite Type widget) | muted text, not a button | "Generate designs to see your most used type" | leave (informational, not a CTA) |
| 14 | `app/(user)/dashboard/page.tsx` (favorite types) | muted text, not a button | "Generate designs to see your favorite types." | leave (informational) |
| 15 | `components/layout/site-footer.tsx` | footer product link | "Generate Design" → `/generate` | leave (footer nav link, not a CTA card) |

**Not CTAs / out of scope:** items 13–15 (informational text and nav/footer links), and the docs under `z/` and `.kiro/specs/` (historical/spec text, not shipped UI).

## Goals

- Remove the redundant Gallery bottom CTA card entirely (item 5).
- Vary generic "Start Generating" empty-state copy to page-specific "Generate your first design" (items 6, 7, and the reusable `EmptyHistory`).
- Downgrade over-prominent empty-state buttons from filled amber to outlined amber (items 6, 7, and `EmptyHistory`'s shared button — see D4).
- Keep all canonical/contextual CTAs unchanged (items 1–4).

## Non-Goals

- No logic changes, no new components, no routing/backend changes.
- No change to the top nav, the Generate page's primary button/header, `/generate` routing, `TemplateCard`, `TemplateDetailModal`, Gallery card behavior, `useFavorites()`, or any shared utility's behavior.
- No change to footer links or informational (non-button) text.

### Files in scope (candidate — see decisions for the about/empty-state calls)

| Action | File | Why |
|---|---|---|
| Update | `app/(user)/gallery/page.tsx` | remove the bottom CTA card (+ now-unused `Link`/`ArrowRight` imports) |
| Update | `app/(user)/history/page.tsx` | empty-state copy → "Generate your first design"; filled → outlined |
| Update | `app/(user)/dashboard/page.tsx` | same empty-state copy + style downgrade (consistency, item 7) |
| Update | `app/about/page.tsx` | copy "Start Generating" → "Generate your first design" (×2) |

> `components/ui/empty-state.tsx` is **out of scope** (D4): its `EmptyHistory` "Start Generating" label is dead/unused code, left untouched and noted for future cleanup.

No other file may be modified.

## Architecture

No architectural change. This is a leaf-level presentational edit across a handful of pages; no data flow, component hierarchy, or routing is altered. The only structural change is the deletion of one JSX block (the Gallery CTA card) and its two now-unused imports.

```
app/(user)/gallery/page.tsx     − remove bottom CTA card block + Link/ArrowRight imports
app/(user)/history/page.tsx     ~ empty-state button: copy + outlined style
app/(user)/dashboard/page.tsx   ~ empty-state button: copy + outlined style
app/about/page.tsx              ~ two CTA labels: copy only
(components/ui/empty-state.tsx) — OUT OF SCOPE per D4 (dead code, untouched)
```

## Data Models

No data models are introduced or changed. This PR touches only static JSX text and Tailwind className strings.

## Components and Interfaces

No component props or public interfaces change. All edits are internal to existing components' render output:

- `GalleryPage` — removes a JSX block; no prop/signature change.
- `HistoryPage`, `DashboardPage` — change button text + classes in the existing inline empty state; no prop change.
- About page — change two anchor label strings.

`components/ui/empty-state.tsx` is untouched (D4); its unused `EmptyHistory` label remains as-is, noted as dead code.

## Detailed Design

### Remove — Gallery bottom CTA card (`app/(user)/gallery/page.tsx`)

Delete the entire `{/* Inline CTA card */}` block (the white bordered card with "Can't find what you're looking for?" + "Generate from Scratch"). After removal, `Link` and `ArrowRight` are no longer referenced in this file (verified: their only uses were inside this card), so both imports are removed to keep the build clean. The `TemplateDetailModal`, toast container, and everything above (grid, pagination) are untouched.

### Vary + downgrade — History main empty state (`app/(user)/history/page.tsx`)

- Copy: button text "Start Generating" → **"Generate your first design"**.
- Style: `px-6 py-3 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-[#F97316]/90` → **outlined**: `px-6 py-3 border-2 border-[#F97316] text-[#F97316] bg-white rounded-xl font-semibold hover:bg-[#F97316]/5 transition-all`.
- The button still calls `router.push("/generate")` (behavior unchanged). Heading "No designs yet" and the descriptive line are unchanged.

### Vary + downgrade — Dashboard recent-designs empty state (`app/(user)/dashboard/page.tsx`)

Identical treatment to History (item 7): "Start Generating" → "Generate your first design", filled → outlined. Included for consistency since the brief says "any other empty-state CTAs found should follow this pattern."

### Vary — About page CTAs (`app/about/page.tsx`)

Two instances of "Start Generating" → **"Generate your first design"** (copy only). See D3 for why these are copy-only (not downgraded).

### Out of scope — Reusable `EmptyHistory` (`components/ui/empty-state.tsx`)

Not modified in this PR (D4). `EmptyHistory()`'s "Start Generating" label is dead/unused code (no imports in shipped pages); it is left untouched and recorded as known dead code for a future cleanup PR.

## Key Design Decisions

**D1 — Categorization follows the brief's keep/remove/vary principles.** Canonical CTAs (nav, Generate page button) and contextual CTAs (Use This Template, Browse Gallery) are kept verbatim. Only the redundant card is removed; generic empty-state copy is varied and de-emphasized.

**D2 — Include the Dashboard empty state (item 7).** It is a verbatim twin of the History empty state ("No designs yet" + filled "Start Generating"). The brief explicitly extends the vary+downgrade pattern to "any other empty-state CTAs found in the audit." Treating only History would leave an inconsistent duplicate, so Dashboard gets the same change.

**D3 — About page: copy-only, no style downgrade.** The two About CTAs are marketing/landing CTAs on a public page, not in-app empty states. The brief's downgrade rule targets *empty-state* buttons specifically ("Empty states should guide gently"). The About page closing CTA is intentionally a conversion button. So these get the copy variation (to kill the repeated generic "Start Generating" phrasing) but keep their existing styles. Flagged for confirmation.

**D4 — `components/ui/empty-state.tsx` is dropped from scope (confirmed).** A workspace search found **no imports** of these components in shipped pages (History/Dashboard render their empty states inline, not via `EmptyHistory`/`EmptyDashboard`). `EmptyHistory` is therefore **dead/unused code**. Per confirmation, this PR does **not** modify it — updating UI that ships nowhere is wasted work. It is recorded here as **known dead code for a future cleanup PR** (could be deleted along with its sibling unused empty-state variants once verified). Result: the file is removed from the in-scope list and the grep verification only targets shipped surfaces.

**D5 — Pure copy/visual, build-safe.** Removing the card orphans `Link`/`ArrowRight` in the gallery file; those imports are removed in the same edit so `npm run build` stays green. No other imports are affected.

## Correctness Properties

### Property 1: Canonical CTAs unchanged
The top-nav "Generate" tab, the Generate page primary button ("Generate Design · {N} credits") and its header, the "Use This Template" modal button, and the "Browse Gallery" favorites button retain their exact text, styles, and behavior.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: Redundant card removed cleanly
The Gallery bottom CTA card no longer renders, and the file has no dangling references (`Link`/`ArrowRight` imports removed); the rest of the Gallery page is unchanged.

**Validates: Requirements 2.1, 2.2, 5.4**

### Property 3: Empty-state copy is page-specific
No shipped empty-state CTA reads the generic "Start Generating"; History and Dashboard read "Generate your first design".

**Validates: Requirements 3.1, 3.2**

### Property 4: Empty-state buttons are downgraded
The History and Dashboard empty-state buttons use the outlined style (`border-2 border-[#F97316] text-[#F97316] bg-white hover:bg-[#F97316]/5`), not filled amber.

**Validates: Requirements 4.1, 4.2**

### Property 5: Behavior preserved
Every changed CTA still navigates to `/generate` (or its prior destination); only text/classes change, no `onClick`/`href` targets change.

**Validates: Requirements 5.1, 5.2, 5.3**

## Error Handling

- Pure presentational change — no runtime errors to handle.
- The only build risk is an orphaned import after card removal; mitigated by removing `Link`/`ArrowRight` from the gallery file in the same edit (Property 2, D5).

## Testing Strategy

- **Visual/manual** — Gallery no longer shows the bottom CTA card; History/Dashboard empty states (0 designs) show "Generate your first design" as an outlined button; About shows the new copy; nav and Generate button unchanged.
- **Grep check** — after the change, a search for `"Start Generating"` and `"Generate from Scratch"` in shipped `app/`/`components/` (excluding `z/` and `.kiro/`) returns no matches.
- **Build gate** — `npx tsc --noEmit` and `npm run build` must pass (catches the orphaned-import risk).

## Resolved Decisions (confirmed)

1. **About page (D3):** copy-only — vary the wording, keep the existing button styles (marketing CTAs, not empty states).
2. **Dashboard (D2):** included in the same vary + downgrade treatment as History.
3. **`EmptyHistory` (D4):** out of scope — dead code, left untouched, noted for future cleanup.

## Constraints Honored

- No top nav, Generate page primary button/header, `/generate` routing, or backend changes.
- No changes to `TemplateCard`, `TemplateDetailModal`, Gallery card behavior, `useFavorites()`, or any shared utility's behavior.
- Pure copy + visual-prominence; no logic, no new components.
- Tokens limited to the approved palette (`#F97316` etc.); outlined style per the brief.
