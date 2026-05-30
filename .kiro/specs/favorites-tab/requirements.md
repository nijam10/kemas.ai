# Requirements Document

## Introduction

This feature makes Gallery template favorites persistent and gives them a destination. Today the heart-icon favorite on Gallery template cards is in-memory only and lost on refresh or navigation. This feature introduces a `useFavorites()` hook that persists favorite template ids to `localStorage` (with cross-tab sync and SSR safety), switches the Gallery page to use it, and adds a two-tab switcher to the History page: "Generations" (the existing History content, untouched) and "Favorites" (a grid of the user's hearted templates rendered with the existing `TemplateCard`).

This is a frontend-only change. Hard constraints: `localStorage` only — no backend, no `/api/`, no server actions, and no backend-coupled hooks (`useGallery`, `useCredits`) are touched; the `TemplateCard` component is reused as-is without prop or render changes; the Generate page and generation flow are not modified; and the History "Generations" content stays exactly as-is, only wrapped in a tab.

In-scope files (exhaustive): create `lib/use-favorites.ts` and `components/history/favorites-section.tsx` (and optionally `components/history/history-tabs.tsx`); update `app/(user)/gallery/page.tsx` and `app/(user)/history/page.tsx`.

## Glossary

- **Favorite**: a template the user has hearted; represented by the template's id.
- **Favorite id set**: the in-memory `Set<string>` of favorited template ids.
- **Storage key**: the `localStorage` key `"kemas-favorite-templates"` holding a JSON array of favorite ids.
- **`useFavorites()`**: the custom hook owning the favorite id set, persistence, and cross-tab sync.
- **Generations tab**: the existing History page content (designs from `useDesigns`), unchanged.
- **Favorites tab**: the new History section showing favorited templates.
- **TemplateCard**: the existing Gallery card component reused unchanged in the Favorites tab.
- **SSR-safe**: produces the same initial markup on server and first client render (no `window`/`localStorage` access during render), avoiding hydration mismatch.
- **Tokens**: `#F97316` primary, `#FACC15` accent, `#FCFBF7` bg, `#E5E4E0` border, `#1A1A1A` heading, `#737373` body, `#A3A3A3` muted.

## Requirements

### Requirement 1: Favorites hook

**User Story:** As a developer, I want a single hook that owns favorite state and persistence, so that the Gallery and History features share one consistent source of truth.

#### Acceptance Criteria

1. THE system SHALL provide `lib/use-favorites.ts` exporting a `useFavorites()` hook that returns `favoriteIds` (`Set<string>`), `isFavorite(id)` (`boolean`), `toggleFavorite(id)` (`void`), and `count` (`number`).
2. WHEN `toggleFavorite(id)` is called for an id not in the set, THE hook SHALL add the id; WHEN called for an id already in the set, THE hook SHALL remove the id.
3. WHEN the favorite id set changes, THE hook SHALL persist the set to the storage key `"kemas-favorite-templates"` as a JSON array of string ids.
4. WHEN the hook is rendered on the server or on the first client render, THE `favoriteIds` SHALL be an empty set so that no hydration mismatch occurs, and THE hook SHALL hydrate from `localStorage` after mount.
5. THE `isFavorite(id)` SHALL return true exactly when `id` is in the set, and `count` SHALL equal the size of the set.
6. IF the stored value is missing, non-JSON, or not a string array, THEN THE hook SHALL fall back to an empty set without throwing.

### Requirement 2: Cross-tab synchronization

**User Story:** As a user with multiple browser tabs open, I want my favorites to stay in sync, so that hearting in one tab is reflected in the others.

#### Acceptance Criteria

1. WHEN another browser tab changes the storage key, THE hook SHALL update its favorite id set from the new stored value via the `storage` event.
2. IF a received `storage` event value cannot be parsed, THEN THE hook SHALL not throw and SHALL leave the current set unchanged or fall back to empty.
3. WHEN the component using the hook unmounts, THE hook SHALL remove its `storage` event listener.

### Requirement 3: History page tab switcher

**User Story:** As a user, I want tabs on the History page, so that I can switch between my generated designs and my saved favorites.

#### Acceptance Criteria

1. THE History page SHALL render a tab switcher below the page hero/title with two tabs: "Generations" and "Favorites".
2. WHEN the page first renders, THE active tab SHALL be "Generations".
3. WHERE a tab is active, THE tab SHALL use amber text with a 2px amber underline; WHERE a tab is inactive, THE tab SHALL use muted body color with no underline, and tab color changes SHALL use `transition-all duration-300 ease-out`.
4. WHERE the favorites count is greater than zero, THE Favorites tab label SHALL include the count (e.g., "Favorites (3)").
5. THE tab state SHALL be local component state and SHALL NOT sync to the URL.

### Requirement 4: Favorites section content

**User Story:** As a user, I want the Favorites tab to show the templates I've hearted, so that I can revisit them.

#### Acceptance Criteria

1. THE system SHALL provide `components/history/favorites-section.tsx` that reads favorites from `useFavorites()`.
2. THE Favorites section SHALL render the templates from `GALLERY_TEMPLATES` whose id is in the favorite id set, and SHALL render no card for ids not present in `GALLERY_TEMPLATES`.
3. THE Favorites section SHALL render templates using the existing `TemplateCard` component without modifying its props or rendering.
4. THE Favorites grid SHALL use a 4-column desktop / 2-column tablet / 1-column mobile responsive layout with a 14px gap.

### Requirement 5: Favorites interactions

**User Story:** As a user, I want to manage favorites directly from the Favorites tab, so that I can remove ones I no longer want.

#### Acceptance Criteria

1. THE heart icon SHALL appear filled amber when a template is favorited and as an outline when it is not, consistent with the Gallery implementation.
2. WHEN the user clicks the heart icon on a card in the Favorites tab, THE template's favorite state SHALL toggle.
3. WHEN a template is unfavorited while on the Favorites tab, THE template's card SHALL be removed from the tab on the next render.

### Requirement 6: Empty state

**User Story:** As a user with no favorites, I want guidance on how to add some, so that I know what the tab is for.

#### Acceptance Criteria

1. WHERE the favorites count is zero, THE Favorites section SHALL render a centered empty state with a lucide `Heart` icon, the heading "No favorites yet", and the subtext "Browse the gallery to save templates you like.".
2. THE empty state SHALL render an amber primary button labeled "Browse Gallery" that navigates to `/gallery` using a Next.js `Link`.

### Requirement 7: Gallery integration

**User Story:** As a user, I want my Gallery hearts to persist, so that favorites survive refresh and navigation.

#### Acceptance Criteria

1. THE Gallery page SHALL use `useFavorites()` in place of the previous in-memory `useState<Set<string>>` for favorites.
2. THE Gallery heart icon click behavior and visual state SHALL remain unchanged from the user's perspective, now backed by persistent storage.
3. WHEN the user favorites a template in the Gallery and then refreshes or navigates away and back, THE template SHALL remain favorited.

### Requirement 8: Scope boundaries and verification

**User Story:** As a maintainer, I want the change self-contained, so that it is safe and easy to review.

#### Acceptance Criteria

1. THE change SHALL NOT modify any file under `app/api/`, any route handler, any server action, or any backend-coupled hook (`useGallery`, `useCredits`).
2. THE favorites feature SHALL persist using `localStorage` only, with no backend.
3. THE change SHALL NOT modify the `TemplateCard` component, the Generate page, or the generation flow.
4. THE History page "Generations" content SHALL remain unchanged in markup and behavior, only conditionally rendered under its tab.
5. WHEN the change is complete, THE commands `npx tsc --noEmit` and `npm run build` SHALL succeed with no type or import errors.
