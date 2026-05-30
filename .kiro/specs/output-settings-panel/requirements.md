# Requirements Document

## Introduction

This feature replaces the **Recent History** card in the right column of the Generate page (`app/(user)/generate/page.tsx`) with an **Output Settings** panel. The panel gives users three single-select controls — number of variants, output format, and resolution — and displays a reactive estimated credit cost. The estimate drives the Generate button's affordability gate and its label.

This is a **frontend-only** change. A hard constraint applies: no backend files are touched (nothing under `/api/`, no route handlers, no server actions, no new request-body parameters, and `useCredits()` is unchanged). The server continues to deduct a flat 10 credits per generation; the panel's total is an **estimate / quote**, not the authoritative charge. The estimate↔charge gap is a documented, accepted trade-off deferred to a future PR.

In-scope files (exhaustive): create `lib/credits.ts` and `components/generation/output-settings-panel.tsx`; update `app/(user)/generate/page.tsx`; delete `components/generation/recent-history-panel.tsx`.

## Glossary

- **Variant count**: the number of output images requested, selectable as 1, 2, 3, or 4. Affects the estimated cost only in this spec (the backend still produces a single image).
- **Output format**: one of PNG transparan (`png`), JPG flat (`jpg`), or 3D mockup (`3d`).
- **Resolution**: one of Standard (`standard`) or HD (`hd`).
- **Format premium**: extra per-variant credits for the chosen format — 0 for PNG/JPG, 5 for 3D.
- **Resolution premium**: extra per-variant credits for the chosen resolution — 0 for Standard, 3 for HD.
- **Total estimasi / totalCredits**: the estimated credit cost, computed as `(10 + format_premium + resolution_premium) × variant_count`.
- **Affordability gate**: the client-side condition that enables or disables the Generate button.
- **Active state**: the visual styling of a selected option — 2px amber border, 10% amber background tint, amber text.
- **Default state**: the visual styling of an unselected option — 1px neutral border, white background.
- **Amber**: `#F97316`. **Neutral border**: `#E5E4E0`. **Heading**: `#1A1A1A`. **Body**: `#737373`. **Muted**: `#A3A3A3`.

## Requirements

### Requirement 1: Variant count control

**User Story:** As a user on the Generate page, I want to choose how many variants to request, so that I can control the scope and estimated cost of my generation.

#### Acceptance Criteria

1. WHERE the Output Settings panel is rendered, THE panel SHALL display a "Jumlah variasi" control as a grid of four buttons labeled 1, 2, 3, and 4.
2. WHEN the page first renders, THE variant count SHALL default to 1.
3. WHEN the user selects a variant button, THE panel SHALL mark exactly that button as the active option and SHALL mark the other three as default state.
4. WHERE the "Jumlah variasi" section label is shown, THE panel SHALL display the hint text "10 credits × jumlah" aligned to the right of the section label.
5. WHEN the user selects a variant button, THE Total estimasi SHALL update to reflect the new variant count.

### Requirement 2: Output format control

**User Story:** As a user on the Generate page, I want to choose the output format, so that I receive the file type I need and understand its cost impact.

#### Acceptance Criteria

1. WHERE the Output Settings panel is rendered, THE panel SHALL display a "Format output" control as three stacked rows, each with an icon and label: "PNG transparan", "JPG flat", and "3D mockup".
2. WHEN the page first renders, THE output format SHALL default to PNG transparan (`png`).
3. WHERE the "3D mockup" row is shown, THE panel SHALL display a "+5" credits badge aligned to the right of that row.
4. WHEN the user selects a format row, THE panel SHALL mark exactly that row as the active option and SHALL mark the others as default state.
5. WHEN the user selects a format row, THE Total estimasi SHALL update to reflect the selected format's premium.

### Requirement 3: Resolution control

**User Story:** As a user on the Generate page, I want to choose the resolution, so that I can balance quality against cost.

#### Acceptance Criteria

1. WHERE the Output Settings panel is rendered, THE panel SHALL display a "Resolusi" control as two buttons in a row labeled "Standard" and "HD".
2. WHEN the page first renders, THE resolution SHALL default to Standard (`standard`).
3. WHERE the "HD" button is shown, THE panel SHALL display a "+3" credits badge after the "HD" text.
4. WHEN the user selects a resolution button, THE panel SHALL mark exactly that button as the active option and SHALL mark the other as default state.
5. WHEN the user selects a resolution button, THE Total estimasi SHALL update to reflect the selected resolution's premium.

### Requirement 4: Credit calculation and total display

**User Story:** As a user, I want to see an estimated total cost that reflects my selections, so that I know what a generation will cost before submitting.

#### Acceptance Criteria

1. THE system SHALL provide a pure function `calculateCredits({ variantCount, format, resolution })` in `lib/credits.ts` that returns `(10 + format_premium + resolution_premium) × variant_count`.
2. WHERE the format is `3d`, THE `calculateCredits` function SHALL apply a format premium of 5; WHERE the format is `png` or `jpg`, THE function SHALL apply a format premium of 0.
3. WHERE the resolution is `hd`, THE `calculateCredits` function SHALL apply a resolution premium of 3; WHERE the resolution is `standard`, THE function SHALL apply a resolution premium of 0.
4. WHERE the Output Settings panel is rendered, THE panel SHALL display a "Total estimasi" row, separated from the controls by a top border, showing the label "Total estimasi" on the left and the computed total in amber on the right.
5. WHEN any of variant count, format, or resolution changes, THE displayed Total estimasi SHALL equal `calculateCredits` of the current selections.
6. THE `lib/credits.ts` module SHALL export the types `OutputFormat` (`"png" | "jpg" | "3d"`) and `Resolution` (`"standard" | "hd"`).

### Requirement 5: Generate button gate and label

**User Story:** As a user, I want the Generate button to reflect the estimated cost and my available balance, so that I cannot submit a generation I cannot afford and I know the price up front.

#### Acceptance Criteria

1. THE Generate page SHALL enable the Generate button only WHEN the credit balance is greater than or equal to the Total estimasi AND the prompt has at least 10 characters AND no submission is in progress.
2. WHILE the Generate button is enabled, THE button label SHALL read "Generate Design · {totalCredits} credits" using the current Total estimasi.
3. IF the credit balance is less than the Total estimasi, THEN THE Generate button SHALL be disabled and SHALL communicate insufficient credits.
4. IF the credit balance is less than the Total estimasi, THEN THE helper text below the button SHALL state how many more credits are needed (`totalCredits - balance`).
5. WHILE the credit balance is still loading, THE Generate button SHALL remain disabled.

### Requirement 6: Layout, styling, and column balance

**User Story:** As a user, I want the new panel to match the page's visual language and balance the three columns, so that the layout feels cohesive and intentional.

#### Acceptance Criteria

1. THE Output Settings panel SHALL replace the Recent History card in the right column WITHOUT changing the 12-column 4-5-3 grid split.
2. THE Output Settings panel root SHALL use `h-full` and an internal vertical flex layout so the panel stretches to match the form card height and the Total estimasi row sits at the bottom.
3. WHERE any selector option is active, THE option SHALL use a 2px amber (`#F97316`) border, a 10% amber background tint, and amber text; WHERE an option is in default state, THE option SHALL use a 1px neutral (`#E5E4E0`) border and a white background.
4. THE Output Settings panel SHALL use only the colors `#F97316`, `#E5E4E0`, `#1A1A1A`, `#737373`, and `#A3A3A3` (plus existing amber tints) and SHALL NOT use AI-themed icons.
5. THE Output Settings panel SHALL use the same card styling as the form card (white background, neutral border, `rounded-2xl`).

### Requirement 7: Header badge update

**User Story:** As a user, I want the header to communicate that cost can vary, so that I understand 10 credits is a starting price rather than a fixed price.

#### Acceptance Criteria

1. THE Generate page header badge SHALL display the text "Starts at 10 credits per generation" in place of "10 credits per generation".

### Requirement 8: Recent History removal and scope boundaries

**User Story:** As a maintainer, I want the obsolete Recent History panel removed cleanly and the backend left untouched, so that the change is self-contained and safe.

#### Acceptance Criteria

1. THE Generate page SHALL NOT import or render `RecentHistoryPanel`.
2. WHEN no source file imports `recent-history-panel.tsx`, THE `components/generation/recent-history-panel.tsx` file SHALL be deleted.
3. THE change SHALL NOT modify any file under `app/api/`, any route handler, or any server action.
4. THE change SHALL NOT add new parameters to the request body sent to `/api/generate`.
5. THE change SHALL NOT modify the `useCredits()` hook.
6. WHEN the change is complete, THE command `npm run build` SHALL succeed with no type or import errors.
