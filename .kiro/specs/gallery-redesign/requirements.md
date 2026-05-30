# Requirements Document

## Introduction

This feature redesigns the Gallery page (`app/(user)/gallery/page.tsx`) so it displays a curated grid of Indonesian snack UMKM packaging templates instead of an API-backed empty state. The page is driven by a hardcoded local dataset and supports client-side search, packaging-type filtering, sorting, pagination, and in-memory favorites. Three reusable components are introduced (`TemplateCard`, `PackagingTypeFilter`, `GalleryPagination`); the hero, search bar, sort bar, grid composition, and CTA stay inline in the page.

This is a frontend-only change. Hard constraints: no files under `/api/`, no server actions, and no auth/credit hooks are touched; the page stops calling `useGallery()` and reads from local data. Favorites and all UI state are in-memory only (no localStorage, no backend). All template content reflects Indonesian snack UMKM.

In-scope files (exhaustive): create `lib/gallery-templates.ts`, `components/gallery/template-card.tsx`, `components/gallery/packaging-type-filter.tsx`, `components/gallery/gallery-pagination.tsx`; update `app/(user)/gallery/page.tsx`; delete any replaced gallery component only after confirming no importers (currently none exist).

## Glossary

- **Template**: a hardcoded packaging style entry (`PackagingTemplate`) with id, name, packaging type, optional badge, usage count, and a mood gradient.
- **Packaging type**: one of Standing Pouch, Pillow Pouch, Box, Jar, Bottle, Sachet (values `standing-pouch`, `pillow-pouch`, `box`, `jar`, `bottle`, `sachet`).
- **Badge**: optional template marker — `popular` (white pill, amber lightning) or `new` (solid amber pill, white text).
- **Favorite**: an in-memory, per-session toggle of a template id; not persisted.
- **Filtered list**: templates remaining after the search query and packaging-type filter are applied.
- **Page size**: the number of templates shown per page — fixed at 12.
- **Mood gradient**: a per-template `gradientFrom`/`gradientTo` hex pair, drawn from the approved token set, used as the card preview background.
- **Tokens**: `#F97316` primary, `#FACC15` accent, `#FCFBF7` bg, `#E5E4E0` border, `#1A1A1A` heading, `#737373` body, `#A3A3A3` muted.

## Requirements

### Requirement 1: Hero section

**User Story:** As a user visiting the Gallery, I want a clear titled hero, so that I understand the page is a curated set of snack packaging styles.

#### Acceptance Criteria

1. THE Gallery page SHALL render a hero with the title "Packaging Style Gallery" preceded by a brand-gradient icon container matching the Generate page pattern (gradient from `#F97316` to `#FACC15`, white icon).
2. THE hero SHALL display a primary description line "Explore curated snack packaging aesthetics crafted for Indonesian UMKM brands."
3. THE hero SHALL display a sub-line "Reuse proven visual directions and customize them with your own product and logo."

### Requirement 2: Search

**User Story:** As a user, I want to search templates, so that I can quickly narrow the grid to relevant styles.

#### Acceptance Criteria

1. THE Gallery page SHALL render a full-width pill-shaped search input with a search icon and the placeholder "Search templates by name, style, or color...".
2. WHEN the user types in the search input, THE filtered list SHALL include only templates whose name or packaging-type label contains the query, compared case-insensitively.
3. WHERE the search query is empty, THE search filter SHALL exclude no templates.
4. WHEN the search query changes, THE current page SHALL reset to 1.

### Requirement 3: Packaging type filter

**User Story:** As a user, I want to filter by packaging type, so that I can see only the formats I care about.

#### Acceptance Criteria

1. THE Gallery page SHALL render a "PACKAGING TYPE" uppercase label above a row of pill chips: All Types, Standing Pouch, Pillow Pouch, Box, Jar, Bottle, Sachet.
2. WHEN the page first renders, THE selected packaging type SHALL default to All Types (`all`).
3. WHEN a packaging-type chip other than All Types is selected, THE filtered list SHALL include only templates whose packaging type equals the selected value; WHEN All Types is selected, THE type filter SHALL exclude no templates.
4. WHEN the selected packaging type changes, THE current page SHALL reset to 1.
5. WHERE a chip is selected, THE chip SHALL use a solid amber background with white text; WHERE a chip is unselected, THE chip SHALL use a white background with a neutral border.
6. THE Gallery page SHALL NOT render a Category filter row.

### Requirement 4: Search and Filters control row

**User Story:** As a user, I want a recognizable filters affordance, so that I anticipate richer filtering later without being blocked now.

#### Acceptance Criteria

1. THE Gallery page SHALL render a pill "Filters" button with a sliders icon to the right of the search input.
2. WHEN the user clicks the "Filters" button, THE page SHALL show a "Coming soon" toast and SHALL NOT open a filter panel.

### Requirement 5: Sort and count bar

**User Story:** As a user, I want to see how many templates match and control their ordering, so that I can find the most relevant ones first.

#### Acceptance Criteria

1. THE Gallery page SHALL render a bar with a bottom border showing "Showing X templates" where X equals the length of the filtered list (before pagination), with the count in heading color.
2. THE Gallery page SHALL render a "Sort by" label and a dropdown button defaulting to "Most Popular" with a chevron-down icon, offering the options Most Popular, Newest, and Most Used.
3. WHEN the user selects a sort option, THE displayed list SHALL be ordered so that Most Popular and Most Used are non-increasing by usage count and Newest is non-increasing by creation date.
4. WHEN the sort option changes, THE current page SHALL reset to 1.

### Requirement 6: Template grid and pagination

**User Story:** As a user, I want a responsive paginated grid, so that I can browse many templates without an overwhelming page.

#### Acceptance Criteria

1. THE Gallery page SHALL render the templates in a grid of 4 columns on desktop, 2 on tablet, and 1 on mobile, with a 14px gap.
2. THE Gallery page SHALL show at most 12 templates per page.
3. THE Gallery page SHALL render centered pagination controls with a chevron-left button, numbered page buttons for each page, and a chevron-right button, with the current page shown as a solid amber filled button.
4. WHEN the user activates a page control, THE grid SHALL display the corresponding 12-template slice of the filtered and sorted list.
5. WHILE on the first page, THE chevron-left control SHALL be disabled; WHILE on the last page, THE chevron-right control SHALL be disabled.
6. WHERE the filtered list fits on a single page, THE pagination controls SHALL NOT be rendered.
7. WHERE the filtered list is empty, THE Gallery page SHALL render an empty state in place of the grid.

### Requirement 7: Template card

**User Story:** As a user, I want informative template cards with a favorite toggle, so that I can recognize styles and mark ones I like.

#### Acceptance Criteria

1. THE template card SHALL render a preview area with a 4:5 aspect ratio, a mood gradient background from the template's `gradientFrom` to `gradientTo`, and a centered enlarged packaging silhouette icon corresponding to the template's packaging type.
2. THE template card SHALL render a heart button in the top-right that appears as an outline when the template is not a favorite and filled amber when it is.
3. WHEN the user clicks the heart button, THE template's favorite state SHALL toggle in memory without triggering any card-level navigation, and SHALL affect no other template.
4. WHERE a template has the `popular` badge, THE card SHALL render a top-left "POPULAR" pill with a lightning icon (amber on white); WHERE a template has the `new` badge, THE card SHALL render a top-left "NEW" pill (white text on solid amber).
5. THE template card footer SHALL render the template name at 12px medium weight and a metadata row reading "{packaging type} · {N} uses".

### Requirement 8: Template data

**User Story:** As a maintainer, I want a typed local dataset of snack templates, so that the gallery renders without any backend.

#### Acceptance Criteria

1. THE system SHALL provide `lib/gallery-templates.ts` exporting a `PackagingTemplate` type and a `GALLERY_TEMPLATES` array of at least 12 snack-specific entries.
2. THE `PackagingTemplate` type SHALL include `id`, `name`, `packagingType`, optional `badge`, `usageCount`, `gradientFrom`, and `gradientTo`.
3. EACH template `usageCount` SHALL be a mock value between 400 and 1500 inclusive.
4. EACH template `gradientFrom` and `gradientTo` SHALL be hex values drawn only from the approved token set, chosen to match the snack mood.
5. EACH template name SHALL be an Indonesian snack name reflecting the UMKM scope.

### Requirement 9: Inline CTA card

**User Story:** As a user who doesn't find a suitable template, I want a clear path to start from scratch, so that I can still create my packaging.

#### Acceptance Criteria

1. THE Gallery page SHALL render an inline white card with a thin border at the bottom of the page (not a full-width gradient banner) containing the heading "Can't find what you're looking for?" and the sub-text "Start from scratch and describe your own snack packaging vision.".
2. THE CTA card SHALL render an amber-filled button labeled "Generate from Scratch →" that navigates to `/generate` using a Next.js `Link`.

### Requirement 10: Styling and interaction consistency

**User Story:** As a user, I want the gallery to feel consistent with the rest of the app, so that interactions are familiar and polished.

#### Acceptance Criteria

1. THE Gallery page and its components SHALL use only the approved tokens `#F97316`, `#FACC15`, `#FCFBF7`, `#E5E4E0`, `#1A1A1A`, `#737373`, `#A3A3A3`.
2. THE interactive elements SHALL use `transition-all duration-300 ease-out`.
3. WHEN a user hovers a template card, THE card SHALL lift via `-translate-y-0.5` and gain a `shadow-md`.
4. THE Gallery page SHALL NOT use AI-themed icons.

### Requirement 11: Scope boundaries and verification

**User Story:** As a maintainer, I want the redesign self-contained, so that it is safe and easy to review.

#### Acceptance Criteria

1. THE change SHALL NOT modify any file under `app/api/`, any route handler, any server action, or any auth/credit hook.
2. THE Gallery page SHALL NOT call `useGallery()` or fetch from `/api/gallery`.
3. THE favorites feature SHALL be in-memory only with no localStorage or backend persistence.
4. WHEN any current gallery component is replaced and confirmed to have no remaining importers, THE replaced component file SHALL be deleted.
5. WHEN the change is complete, THE commands `npx tsc --noEmit` and `npm run build` SHALL succeed with no type or import errors.
