# Requirements Document

## Introduction

This feature redesigns the Gallery template cards to add a hover-reveal info overlay and a click-through Template Detail modal, and makes favorites persistent. The card preview keeps the existing gradient background with a packaging-type-specific silhouette on top (no photos). The `PackagingTemplate` data shape expands to carry style tags, a creative description, and a color palette (gradients are kept). The Gallery page gains modal state plus click, keyboard (Escape), and body-scroll-lock handling.

This is a frontend-only change. Hard constraints: no backend, `/api/`, or server actions; template data stays hardcoded; **no images** are used (gradient + silhouette only — no `next/image`, no `picsum.photos`, no `next.config.ts` change); the "Use This Template" button only navigates to `/generate` via a Next.js `Link` (no template-to-Generate propagation). Favorites are made persistent via a new `useFavorites()` hook backed by `localStorage`. The History page and `components/history/*` are out of scope (the History Favorites tab is a separate, deferred PR); the Generate page/flow is not changed; and `components/icons/packaging-icons.tsx` and `components/generation/packaging-type-selector.tsx` already exist/are already wired (from a prior PR) and are consumed but not modified.

In-scope files (exhaustive): create `lib/use-favorites.ts` and `components/gallery/template-detail-modal.tsx`; update `lib/gallery-templates.ts`, `components/gallery/template-card.tsx`, and `app/(user)/gallery/page.tsx`.

## Glossary

- **Template**: a hardcoded `PackagingTemplate` entry.
- **Gradient preview**: the card's 4:5 preview area filled with the template's `gradientFrom`→`gradientTo` linear gradient.
- **Silhouette**: a per-`packagingType` vector icon (from `components/icons/packaging-icons.tsx`) centered on the gradient preview.
- **Hover overlay**: a bottom-anchored panel revealed on card hover, showing the template name and style-tag pills.
- **Style tag**: a short mood word (e.g., "elegant", "spicy") shown as a pill.
- **Detail modal**: the centered dialog opened by clicking a card, showing the preview + metadata.
- **Color palette**: 4–6 hex values shown as swatch circles in the modal.
- **Favorites**: the user's saved template ids, toggled via the heart icon and persisted in `localStorage`.
- **`useFavorites()`**: the new hook owning the favorite id set, persistence, and cross-tab sync.
- **Storage key**: the `localStorage` key `"kemas-favorite-templates"` holding a JSON array of favorite ids.
- **SSR-safe**: produces the same initial markup on server and first client render (no `window`/`localStorage` during render), avoiding hydration mismatch.
- **Tokens**: `#F97316` primary, `#FACC15` accent, `#FCFBF7` bg, `#E5E4E0` border, `#1A1A1A` heading, `#737373` body, `#A3A3A3` muted. Black overlays/backdrops are decorative and permitted.

## Requirements

### Requirement 1: Gradient + per-type silhouette card preview

**User Story:** As a user browsing the Gallery, I want each card preview to reflect its packaging type, so that I can tell the formats apart at a glance.

#### Acceptance Criteria

1. THE template card SHALL render a 4:5 preview area filled with the template's `gradientFrom`→`gradientTo` linear gradient.
2. THE card SHALL render, centered on the gradient, the silhouette corresponding to the template's `packagingType`, drawn from `components/icons/packaging-icons.tsx`, in white with `strokeWidth` 2, sized roughly 55–60% of the preview height.
3. EACH of the six packaging types (Standing Pouch, Pillow Pouch, Box, Jar, Bottle, Sachet) SHALL render its own distinct silhouette.
4. THE card SHALL NOT use any raster image, the Next.js `Image` component, or external image hosts, and SHALL NOT render the previous footer below the preview.

### Requirement 2: Hover overlay with product info

**User Story:** As a user, I want a card's details to appear on hover, so that the grid stays clean but information is one gesture away.

#### Acceptance Criteria

1. WHILE a card is not hovered, THE card SHALL show only the gradient + silhouette preview with the always-visible heart icon and the optional POPULAR/NEW badge, and SHALL hide the template name and style-tag pills.
2. WHILE a card is hovered, THE card SHALL reveal a bottom overlay containing the template name and a row of style-tag pills.
3. THE hover overlay SHALL use a dark top-fading gradient backdrop and frosted-glass style tag pills (semi-transparent white background, blur, white border, white text).
4. WHEN hover begins, THE overlay SHALL animate from hidden (translated down, transparent) to visible using `transition-all duration-300 ease-out`, and THE card container SHALL lift via `-translate-y-1` and gain `shadow-lg`.
5. THE heart icon (top-right) and the POPULAR/NEW badge (top-left) SHALL remain visible in both hover and non-hover states.

### Requirement 3: Card click opens the detail modal

**User Story:** As a user, I want to click a card to see full details, so that I can evaluate a template before using it.

#### Acceptance Criteria

1. WHEN the user clicks anywhere on a card other than the heart icon, THE Gallery SHALL open the Template Detail modal for that template.
2. THE Gallery page SHALL hold the open template in `selectedTemplate` state, and THE modal SHALL be rendered if and only if `selectedTemplate` is not null.
3. WHEN the user clicks the close (X) button or the backdrop, THE Gallery SHALL set `selectedTemplate` to null and close the modal.
4. WHEN the user presses the Escape key while the modal is open, THE Gallery SHALL close the modal.
5. WHEN the user clicks the heart icon on a card, THE click SHALL toggle favorite state via `stopPropagation` and SHALL NOT open the modal.
6. WHILE the modal is open, THE body scroll SHALL be locked, and WHEN the modal closes or unmounts, THE previous scroll behavior SHALL be restored.

### Requirement 4: Expanded template data

**User Story:** As a maintainer, I want each template to carry richer metadata, so that the modal can render tags, a description, and colors.

#### Acceptance Criteria

1. THE `PackagingTemplate` type SHALL add `styleTags` (string array), `description` (string), and `colorPalette` (string array of hex values), and SHALL retain `gradientFrom` and `gradientTo`.
2. EACH template SHALL retain non-empty `gradientFrom` and `gradientTo` values used for the card/modal preview.
3. EACH template SHALL have 2 to 3 `styleTags` drawn from mood-driven words and a 2-to-3-sentence `description`.
4. EACH template SHALL have 4 to 6 `colorPalette` hex values matching its mood.
5. THE `PackagingTemplate` type SHALL retain a `createdAt` field so the existing Gallery "Newest" sort continues to function.
6. THE `PackagingTemplate` type SHALL NOT include an `imageUrl` field (the image approach is not used).

### Requirement 5: Template detail modal content and layout

**User Story:** As a user, I want a rich detail view, so that I understand a template's mood, styles, and colors before choosing it.

#### Acceptance Criteria

1. THE detail modal SHALL render a backdrop (`fixed inset-0`, dark translucent, blurred) and a centered white container with max-width 900px, max-height 85vh, rounded corners, and a scale-up entrance.
2. THE modal SHALL use a two-column layout: a left column (~60%) with a large gradient + silhouette preview of the template and a right column (~40%, padded) with the information panel.
3. THE modal SHALL display a close (X) button in the top-right with a neutral hover effect.
4. THE right column SHALL display, in order, the template name (large bold heading), a packaging-type pill, a "Description" section with the template's description, a "Styles" section rendering the style tags as larger amber-bordered pills, and a "Colors" section rendering the palette as 4–6 filled 28px circles.
5. THE right column SHALL end with a full-width amber "Use This Template" button with an ArrowRight icon that navigates to `/generate` using a Next.js `Link`.

### Requirement 6: Modal reflects the selected template

**User Story:** As a user, I want the modal to show the template I clicked, so that the information is accurate.

#### Acceptance Criteria

1. WHEN the modal opens for a template, THE preview gradient and silhouette SHALL correspond to that template's `gradientFrom`/`gradientTo` and `packagingType`.
2. THE modal name and packaging-type pill SHALL correspond to the selected template.
3. THE modal description SHALL be the selected template's `description`.
4. THE modal style pills SHALL be the selected template's `styleTags`.
5. THE modal color swatches SHALL be the selected template's `colorPalette`.

### Requirement 7: No image dependencies

**User Story:** As a developer, I want previews rendered without external images, so that the gallery has no image-host or loading dependencies.

#### Acceptance Criteria

1. THE change SHALL NOT modify `next.config.ts` and SHALL NOT add any external image host.
2. THE card and modal SHALL render previews as CSS gradients with inline SVG silhouettes, and SHALL NOT use the Next.js `Image` component or any raster image.

### Requirement 8: Scope boundaries and verification

**User Story:** As a maintainer, I want the redesign self-contained, so that it is safe and easy to review.

#### Acceptance Criteria

1. THE change SHALL NOT modify any file under `app/api/`, any route handler, or any server action.
2. THE change SHALL NOT modify the History page (`app/(user)/history/page.tsx`) or create any `components/history/*` files (the History Favorites tab is a deferred PR).
3. THE change SHALL NOT modify the Generate page or the generation flow; "Use This Template" SHALL only navigate to `/generate`.
4. THE template data SHALL remain hardcoded with no backend calls.
5. THE `TemplateCard` component prop interface (`isFavorite`, `onToggleFavorite`) SHALL remain unchanged in spirit when the Gallery switches to the `useFavorites()` hook (an `onOpen` handler may be added).
6. THE change SHALL NOT modify `components/icons/packaging-icons.tsx` or `components/generation/packaging-type-selector.tsx` (already created/wired by a prior PR; consumed only).
7. WHEN the change is complete, THE commands `npx tsc --noEmit` and `npm run build` SHALL succeed with no type or import errors.

### Requirement 9: Persistent favorites hook

**User Story:** As a user, I want my hearted templates to persist, so that my favorites survive page refresh and navigation.

#### Acceptance Criteria

1. THE system SHALL provide `lib/use-favorites.ts` exporting a `useFavorites()` hook that returns `favoriteIds` (`Set<string>`), `isFavorite(id)` (`boolean`), `toggleFavorite(id)` (`void`), and `count` (`number`).
2. WHEN the favorite id set changes, THE hook SHALL persist it to the `localStorage` key `"kemas-favorite-templates"` as a JSON array of string ids.
3. WHEN the hook mounts on the client, THE hook SHALL hydrate the favorite id set from that `localStorage` key.
4. WHEN `toggleFavorite(id)` is called for an id not in the set, THE hook SHALL add it; WHEN called for an id already in the set, THE hook SHALL remove it.
5. WHEN another browser tab changes the storage key, THE hook SHALL update its set from the new value via the `storage` event, and SHALL remove the listener on unmount.
6. WHEN the hook is rendered on the server or first client render, THE `favoriteIds` SHALL be an empty set so no hydration mismatch occurs.
7. IF the stored value is missing, non-JSON, or not a string array, THEN THE hook SHALL fall back to an empty set without throwing.
8. THE Gallery page SHALL use `useFavorites()` in place of its previous local `useState<Set<string>>`, and the heart click behavior and visual state SHALL remain unchanged from the user's perspective.
