# Requirements Document

## Introduction

This feature makes two coordinated changes to the History page (`app/(user)/history/page.tsx`) in one PR. First, it fixes four sidebar widgets that render broken placeholder/seed content when there are zero designs (Invalid Date rows, a bare asterisk, a fabricated "Standing Pouch" type, and a progress bar filled to 60% at 0 credits). Second, it adds a two-tab switcher — "Generations" (the existing content with the bug fixes applied) and "Favorites" (a grid of templates the user hearted in the Gallery), consuming the existing `useFavorites()` hook and reusing the Gallery's `TemplateCard` and `TemplateDetailModal`.

This is a frontend-only change. Hard constraints: no files under `/api/`, no server actions, and no data-fetching/auth/credit hooks are modified (`useDesigns` and `useFavorites` are consumed as-is); `TemplateCard` and `TemplateDetailModal` prop interfaces are unchanged; `GALLERY_TEMPLATES`, the Gallery page, and `components/gallery/*` are not modified; and bug fixes happen at the rendering layer only. The four buggy widgets are currently inline in `page.tsx` (no separate widget files), so fixes are applied in place.

In-scope files (exhaustive): update `app/(user)/history/page.tsx`; create `components/history/history-tabs.tsx` and `components/history/favorites-section.tsx`.

## Glossary

- **Design**: a generated packaging entry returned by `useDesigns()` and mapped into the `history` array.
- **Sidebar widgets**: the four inline panels on the Generations view — Recent Downloads, Last Generated, Favorite Type, This Week.
- **Empty state**: clean muted text (and optional small icon) shown when a widget or section has no real data.
- **Favorite**: a Gallery template the user hearted; its id is held by `useFavorites()` and persisted in `localStorage`.
- **Generations tab**: the existing History content (stat cards, filter bar, design grid, sidebar widgets).
- **Favorites tab**: the new section showing favorited templates.
- **TemplateCard / TemplateDetailModal**: existing Gallery components reused unchanged.
- **Tokens**: `#F97316` primary, `#FACC15` accent, `#FCFBF7` bg, `#E5E4E0` border, `#1A1A1A` heading, `#737373` body, `#A3A3A3` muted.

## Requirements

### Requirement 1: Sidebar widget empty-state bug fixes

**User Story:** As a user with no designs yet, I want the History sidebar widgets to show honest empty states, so that I don't see broken or fabricated data.

#### Acceptance Criteria

1. WHERE there are no designs, THE Recent Downloads widget SHALL render an empty state (small icon plus muted text such as "No recent downloads") and SHALL NOT render any "Invalid Date" text or empty rows.
2. WHERE there are no designs, THE Last Generated widget SHALL render muted text such as "No designs yet" with helper text such as "Generate one to get started", and SHALL NOT present an enabled "View Design" action.
3. WHERE there are no designs, THE Favorite Type widget SHALL render muted guidance text such as "Generate designs to see your most used type" and SHALL NOT display any packaging-type name.
4. WHERE Credits Used is 0, THE This Week progress bar fill SHALL have width 0%, and for any value THE fill width SHALL be a bounded percentage between 0% and 100%.
5. WHERE designs exist, EACH widget SHALL render its real values (the existing behavior), now computed from actual data rather than hardcoded placeholders.
6. THE bug fixes SHALL be implemented at the rendering layer and SHALL NOT modify any data-fetching hook.

### Requirement 2: Tab switcher

**User Story:** As a user, I want tabs on the History page, so that I can switch between my generated designs and my saved favorites.

#### Acceptance Criteria

1. THE History page SHALL render a tab switcher below the "Your Packaging History" header with two tabs: "Generations" and "Favorites".
2. WHEN the page first renders, THE active tab SHALL be "Generations".
3. WHERE a tab is active, THE tab SHALL use amber text (`#F97316`) with a 2px amber underline; WHERE a tab is inactive, THE tab SHALL use muted body color with no underline; and tab transitions SHALL use `transition-all duration-300 ease-out`.
4. WHERE the favorites count is greater than zero, THE Favorites tab label SHALL include the count (e.g., "Favorites (3)").
5. THE tab state SHALL be local component state and SHALL NOT sync to the URL.

### Requirement 3: Favorites tab content

**User Story:** As a user, I want the Favorites tab to show the templates I hearted, so that I can revisit and manage them.

#### Acceptance Criteria

1. THE Favorites section SHALL read favorites from `useFavorites()` and render the `GALLERY_TEMPLATES` whose id is in the favorite id set.
2. THE Favorites section SHALL render templates using the existing `TemplateCard` component without changing its props or rendering, in a grid of 4 columns desktop / 2 tablet / 1 mobile with a 14px gap.
3. THE Favorites section SHALL render no card for a favorite id that is not present in `GALLERY_TEMPLATES`.
4. WHEN the user clicks a template card (other than the heart icon), THE page SHALL open the existing `TemplateDetailModal` for that template without changing its props.
5. WHEN the user clicks the heart icon on a card in the Favorites tab, THE template SHALL be unfavorited and its card SHALL be removed from the grid on the next render.
6. WHERE the favorites count is zero, THE Favorites section SHALL render a centered empty state with a lucide `Heart` icon (~48px, muted), the heading "No favorites yet", the subtext "Browse the gallery to save templates you like.", and an amber "Browse Gallery" button that navigates to `/gallery` using a Next.js `Link`.

### Requirement 4: Tab layout and content exclusivity

**User Story:** As a user, I want each tab to show only its relevant content, so that the layout is clean and unambiguous.

#### Acceptance Criteria

1. WHILE the Favorites tab is active, THE page SHALL NOT render the sidebar widgets (Recent Downloads, Last Generated, Favorite Type, This Week), and THE favorites grid SHALL use the full content width.
2. WHILE the Generations tab is active, THE page SHALL render the existing content (filter bar, design grid or its empty state, and the sidebar widgets) essentially unchanged aside from the Requirement 1 fixes.
3. THE page SHALL render exactly one tab's content branch at a time.

### Requirement 5: Scope boundaries and verification

**User Story:** As a maintainer, I want the change self-contained, so that it is safe and easy to review.

#### Acceptance Criteria

1. THE change SHALL NOT modify any file under `app/api/`, any route handler, any server action, or any data-fetching/auth/credit hook.
2. THE change SHALL NOT modify `TemplateCard`, `TemplateDetailModal`, the `useFavorites()` hook, `GALLERY_TEMPLATES`, the Gallery page, or any file in `components/gallery/`.
3. THE change SHALL keep favorites persistence as `localStorage`-only via the existing hook (no backend).
4. WHEN the change is complete, THE commands `npx tsc --noEmit` and `npm run build` SHALL succeed with no type or import errors.
