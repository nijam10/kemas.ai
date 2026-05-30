# Requirements Document

## Introduction

The app repeats generic "Start Generating" / "Generate" calls-to-action in multiple places, weakening their impact and duplicating the top-nav "Generate" tab. This feature audits every generation CTA, then reduces redundancy: it removes the redundant Gallery bottom CTA card, varies generic empty-state copy to page-specific wording ("Generate your first design"), and downgrades over-prominent empty-state buttons from filled amber to a gentler outlined style. Canonical CTAs (nav tab, Generate page button) and contextual CTAs (Use This Template, Browse Gallery) are kept unchanged.

This is a pure copy and visual-prominence change. Hard constraints: no logic changes, no new components, no routing or backend changes; the top navigation, the Generate page's primary "Generate Design" button and header, `/generate` routing, `TemplateCard`, `TemplateDetailModal`, Gallery card behavior, `useFavorites()`, and any shared utility behavior are not modified.

In-scope files (from the audit): `app/(user)/gallery/page.tsx`, `app/(user)/history/page.tsx`, `app/(user)/dashboard/page.tsx`, `app/about/page.tsx`. The reusable `components/ui/empty-state.tsx` is out of scope (dead/unused code, left untouched).

## Glossary

- **Canonical CTA**: the single authoritative generate action — the top-nav "Generate" tab and the Generate page's primary submit button.
- **Contextual CTA**: an action with a distinct, situation-specific label (e.g., "Use This Template", "Browse Gallery") that is not a duplicate of the generate action.
- **Empty-state CTA**: a button shown when a list/section has no data, guiding the user toward a first action.
- **Redundant CTA card**: a standalone card whose function duplicates the nav "Generate" tab (the Gallery bottom card).
- **Downgrade (outlined style)**: replacing a filled-amber button with `border-2 border-[#F97316] text-[#F97316] bg-white hover:bg-[#F97316]/5`.
- **Tokens**: `#F97316` primary, `#E5E4E0` border, `#1A1A1A` heading, `#737373` body, `#A3A3A3` muted.

## Requirements

### Requirement 1: Preserve canonical and contextual CTAs

**User Story:** As a user, I want the primary ways to generate and the contextual actions to stay exactly as they are, so that core navigation and actions remain familiar.

#### Acceptance Criteria

1. THE change SHALL NOT modify the top-navigation "Generate" tab.
2. THE change SHALL NOT modify the Generate page's primary "Generate Design" button (label, style, behavior) or the page header.
3. THE change SHALL NOT modify the "Use This Template" button in `TemplateDetailModal`.
4. THE change SHALL NOT modify the "Browse Gallery" button in the Favorites empty state.

### Requirement 2: Remove the redundant Gallery CTA card

**User Story:** As a user, I don't want a redundant "Generate from Scratch" card on the Gallery page, so that the page is less noisy and doesn't duplicate the nav.

#### Acceptance Criteria

1. THE Gallery page SHALL NOT render the bottom inline CTA card ("Can't find what you're looking for?" + "Generate from Scratch").
2. WHEN the CTA card is removed, THE Gallery file SHALL have no unused imports left by the removal (`Link`, `ArrowRight`), and the rest of the page SHALL be unchanged.

### Requirement 3: Vary generic empty-state copy

**User Story:** As a user seeing an empty list, I want context-specific guidance, so that the message fits the page instead of a generic prompt.

#### Acceptance Criteria

1. THE History page main empty-state button SHALL read "Generate your first design" instead of "Start Generating".
2. THE Dashboard recent-designs empty-state button SHALL read "Generate your first design" instead of "Start Generating".
3. THE reusable `EmptyHistory` component (`components/ui/empty-state.tsx`) is dead/unused code and SHALL be left untouched in this PR (recorded as known dead code for future cleanup).
4. THE About page CTAs that read "Start Generating" SHALL be updated to "Generate your first design".
5. WHEN the change is complete, no shipped empty-state CTA under `app/` SHALL display the generic text "Start Generating".

### Requirement 4: Reduce empty-state button prominence

**User Story:** As a user, I want empty states to guide gently rather than pressure me, so that the experience feels helpful.

#### Acceptance Criteria

1. THE History main empty-state button SHALL use the outlined style `border-2 border-[#F97316] text-[#F97316] bg-white hover:bg-[#F97316]/5` instead of filled amber.
2. THE Dashboard recent-designs empty-state button SHALL use the same outlined style instead of filled amber.

### Requirement 5: Behavior, scope, and verification

**User Story:** As a maintainer, I want the change to be purely cosmetic and self-contained, so that it is safe and easy to review.

#### Acceptance Criteria

1. EACH changed CTA SHALL retain its existing navigation target (e.g., `/generate`); only text and/or className change.
2. THE change SHALL NOT modify `/generate` routing, any file under `app/api/`, any server action, `useFavorites()`, or any shared utility's behavior.
3. THE change SHALL NOT add new components or change any component's prop interface.
4. THE change SHALL only create or modify the files identified by the audit and SHALL leave footer links and informational (non-button) text unchanged.
5. WHEN the change is complete, THE commands `npx tsc --noEmit` and `npm run build` SHALL succeed with no type or import errors.
