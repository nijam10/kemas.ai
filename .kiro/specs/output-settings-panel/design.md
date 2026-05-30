# Design — Output Settings Panel (Generate Page)

## Overview

Replace the **Recent History** card in the right column of the Generate page with an **Output Settings** panel containing three single-select controls (variant count, output format, resolution) and a reactive **Total estimasi** cost row. The panel computes a credit cost that drives the Generate button's affordability gate and label. The three-column layout (4-5-3) is preserved; `h-full` on the panel root balances the right column against the form card height.

This is a **frontend feature**: one new component, one pure utility module, edits to `app/(user)/generate/page.tsx`, and deletion of the now-unused `recent-history-panel.tsx`. No routing or backend route changes.

## Current State (ground truth)

Verified against the actual codebase:

| Item in the request | Reality in current code | Implication |
|---|---|---|
| `RecentHistoryPanel` in right column | ✅ Exists, rendered at `lg:col-span-3`; only `page.tsx` imports it | Safe to replace and delete |
| Header badge `"10 credits per generation"` | ✅ Exists in `page.tsx` | Change to `"Starts at 10 credits per generation"` |
| Affordability gate uses `10` | `canGenerate` uses `balance >= 10` | Replace literal `10` with `totalCredits` |
| "Update credit deduction to subtract `totalCredits` instead of hardcoded 10" | ❌ **No client-side deduction exists.** Balance is read-only via `useCredits()`; deduction is **server-side & idempotent** in `/api/generate/[designId]/status`, hardcoded to flat **10** | See Decision D1 — the client-side "10" that this maps to is the affordability **gate**, not a deduction |

Current generate flow: page builds `FormData` (`prompt`, `packagingType`, `logo`) → `POST /api/generate`. The server creates the Design/Job, submits to ComfyUI, and deducts a flat 10 credits on completion. The client never deducts credits locally.

## Goals

- Add an **Output Settings** panel (variants / format / resolution) with a reactive total-cost row.
- Add a pure credit-calculation utility (`lib/credits.ts`) with exported `OutputFormat` and `Resolution` types.
- Wire `totalCredits` into the Generate button's affordability gate and dynamic label.
- Change the header badge to `"Starts at 10 credits per generation"`.
- Balance the right column via `h-full` + internal `flex flex-col`.
- Remove and delete `RecentHistoryPanel`.

## Non-Goals

- **Hard constraint — no backend changes whatsoever.** No edits to any file under `/api/`, route handlers, or server actions. No new parameters added to the `/api/generate` request body. `useCredits()` stays exactly as-is. The server continues to deduct a flat 10 credits per generation. (See Known Trade-offs / Future Work.)
- No routing changes; `/history` stays reachable from the top nav.
- No changes to the Live Generation Flow card, the center column, colors, fonts, or radii.
- No multi-image generation — `variantCount` affects cost/labeling only in this spec.

### Files in scope (exhaustive)

| Action | File |
|---|---|
| Create | `lib/credits.ts` |
| Create | `components/generation/output-settings-panel.tsx` |
| Update | `app/(user)/generate/page.tsx` |
| Delete | `components/generation/recent-history-panel.tsx` |

No other file may be modified.

## Architecture

### Layout change (4-5-3 split unchanged)

```
Generate page (app/(user)/generate/page.tsx)
└─ grid lg:grid-cols-12  (items-stretch)
   ├─ Left  (col-span-4): form card .............. unchanged structure
   ├─ Center(col-span-5): idle / submitting state . unchanged
   └─ Right (col-span-3):
        - RecentHistoryPanel   ← REMOVED + file deleted
        + OutputSettingsPanel  ← NEW  (h-full, flex flex-col)
```

### Files

| File | Action | Purpose |
|---|---|---|
| `lib/credits.ts` | **new** | `OutputFormat`, `Resolution` types + pure `calculateCredits()` |
| `components/generation/output-settings-panel.tsx` | **new** | The settings UI; fully controlled via props |
| `app/(user)/generate/page.tsx` | **edit** | Swap panel, add state, derive `totalCredits`, update gate + button label + header badge |
| `components/generation/recent-history-panel.tsx` | **delete** | After confirming no remaining importers |

## Data Models

No database models change. "Data" is client-side UI state plus exported utility types.

```ts
// lib/credits.ts
export type OutputFormat = "png" | "jpg" | "3d";
export type Resolution = "standard" | "hd";

export interface CreditCalculationInput {
  variantCount: number;   // 1..4
  format: OutputFormat;    // default "png"
  resolution: Resolution;  // default "standard"
}
```

Client UI state held in `page.tsx`:

| State | Type | Default |
|---|---|---|
| `variantCount` | `number` (1\|2\|3\|4) | `1` |
| `outputFormat` | `OutputFormat` | `"png"` |
| `resolution` | `Resolution` | `"standard"` |
| `totalCredits` | derived `number` | `10` |

Existing Prisma models (`CreditWallet`, `CreditTransaction`, `Design`, `GenerationJob`) are unchanged; the flat-10 server deduction is unchanged under D1.

## Components and Interfaces

### New: `lib/credits.ts`

```ts
export type OutputFormat = "png" | "jpg" | "3d";
export type Resolution = "standard" | "hd";

export interface CreditCalculationInput {
  variantCount: number;
  format: OutputFormat;
  resolution: Resolution;
}

export const BASE_CREDITS = 10;
export const FORMAT_3D_PREMIUM = 5;
export const RESOLUTION_HD_PREMIUM = 3;

export function calculateCredits({
  variantCount,
  format,
  resolution,
}: CreditCalculationInput): number {
  const formatPremium = format === "3d" ? FORMAT_3D_PREMIUM : 0;
  const resolutionPremium = resolution === "hd" ? RESOLUTION_HD_PREMIUM : 0;
  return (BASE_CREDITS + formatPremium + resolutionPremium) * variantCount;
}
```

**Cost model** — `(10 + format_premium + resolution_premium) × variant_count`:

| Variants | Format | Resolution | Per-variant | Total |
|---|---|---|---|---|
| 1 | PNG | Standard | 10 | **10** |
| 2 | JPG | Standard | 10 | **20** |
| 1 | 3D | Standard | 15 | **15** |
| 1 | PNG | HD | 13 | **13** |
| 1 | 3D | HD | 18 | **18** |
| 4 | 3D | HD | 18 | **72** |

### New: `OutputSettingsPanel` (fully controlled, stateless)

```ts
interface OutputSettingsPanelProps {
  variantCount: number;
  format: OutputFormat;
  resolution: Resolution;
  totalCredits: number;
  onVariantCountChange: (n: number) => void;
  onFormatChange: (f: OutputFormat) => void;
  onResolutionChange: (r: Resolution) => void;
}
```

Parent owns state so the Generate button reads the same values. Structure top→bottom:

- **Root**: `bg-white border border-[#E5E4E0] rounded-2xl p-5 h-full flex flex-col`.
- **Header**: `Sliders` icon (`w-4 h-4 text-[#F97316]`) + `"Output Settings"` (`text-lg font-bold text-[#1A1A1A]`), `mb-4`.
- **Controls wrapper**: `flex-1 space-y-5`.

  - **A — Jumlah variasi**: label row with `"Jumlah variasi"` (left, `text-sm font-semibold text-[#1A1A1A]`) and hint `"10 credits × jumlah"` (right, `text-xs text-[#A3A3A3]`). Below: `grid grid-cols-4 gap-2` of buttons `1 2 3 4`. Single-select, default `1`.
  - **B — Format output**: label `"Format output"`. Below: 3 stacked rows (`space-y-2`), each a full-width button with icon + label — `PNG transparan` (`ImageIcon`), `JPG flat` (`FileImage`), `3D mockup` (`Box`, with a right-aligned `+5` credits badge). Single-select, default `"png"`.
  - **C — Resolusi**: label `"Resolusi"`. Below: `grid grid-cols-2 gap-2` — `Standard` and `HD` (HD shows a `+3` badge after the text). Single-select, default `"standard"`.

- **Footer — Total estimasi**: `mt-auto pt-4 border-t border-[#E5E4E0]`, `flex items-center justify-between`. Left `"Total estimasi"` (`text-sm text-[#737373]`); right `{totalCredits} credits` in amber (`text-[#F97316] font-bold`), reactive from the `totalCredits` prop.

**Selector visual states (shared across all three groups):**
- Active: `border-2 border-[#F97316] bg-[#F97316]/10 text-[#F97316]`.
- Default: `border border-[#E5E4E0] bg-white text-[#1A1A1A]`.

> Icons (`Sliders`, `ImageIcon`, `FileImage`, `Box`) are from lucide-react (project's icon set) and are non-AI-themed, satisfying the project rule. Palette limited to `#F97316 / #E5E4E0 / #1A1A1A / #737373 / #A3A3A3` (+ existing amber tints).

### Changed: `GeneratePage`

Adds local state and derived total:

```ts
const [variantCount, setVariantCount] = useState(1);
const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");
const [resolution, setResolution] = useState<Resolution>("standard");

const totalCredits = calculateCredits({ variantCount, format: outputFormat, resolution });
```

- **Right column**: render `<OutputSettingsPanel ... />` instead of `<RecentHistoryPanel />`.
- **Affordability gate**: `canGenerate` uses `balance >= totalCredits` (was `balance >= 10`).
- **Button label**: when generatable, `Generate Design · {totalCredits} credits`; insufficient branch still shows "Not enough credits" but compares against `totalCredits`.
- **Helper text**: reflects the computed total (e.g. `"{totalCredits} credits will be deducted only after successful generation"`; insufficient: `"You need {totalCredits - balance} more credits to generate"`).
- **Header badge**: `"10 credits per generation"` → `"Starts at 10 credits per generation"`.

## Key Design Decisions

**D1 — What "update credit deduction to subtract totalCredits" maps to (RESOLVED: Option A).**
There is **no client-side deduction** in the current code. Balance is read-only from `useCredits()`, and the actual deduction is server-side (flat 10, idempotent by `designId`). The only client-side place that references "10" is the affordability **gate** inside `canGenerate`. **Chosen approach (A):** the gate and button label use `totalCredits`; the server still deducts a flat 10 on completion. This is the minimal, in-scope change and touches no routes. The estimate↔charge gap is documented under Known Trade-offs / Future Work. (Option B — billing the real total server-side — is explicitly out of scope and deferred to a future PR.)

**D2 — Controlled component.** `OutputSettingsPanel` holds no state; the parent owns it so the gate, label, and total all read one source of truth (avoids divergence, satisfies Property 4/5).

## Correctness Properties

### Property 1: Cost lower bound
`calculateCredits` always returns `>= BASE_CREDITS` (10) for any `variantCount >= 1`.

**Validates: Requirements 1.1, 4.1**

### Property 2: Linear in variants
With format/resolution fixed, `total === perVariant * variantCount`; increasing `variantCount` never decreases the total.

**Validates: Requirements 1.2, 4.2**

### Property 3: Premium additivity
`total === (10 + (format==="3d"?5:0) + (resolution==="hd"?3:0)) * variantCount`; 3D adds exactly `5 * variantCount`, HD adds exactly `3 * variantCount`.

**Validates: Requirements 2.3, 3.2, 4.3**

### Property 4: Gate and label consistency
The Generate button is enabled iff `balance >= totalCredits && prompt.trim().length >= 10`; when enabled, the label shows the same `totalCredits` used by the gate.

**Validates: Requirements 5.1, 5.2**

### Property 5: Reactive total
The footer "Total estimasi" always equals the `totalCredits` prop, which equals `calculateCredits` of the current selections (no stale value).

**Validates: Requirements 4.4**

### Property 6: Single-select per group
Each of the three groups has exactly one active option at all times (defaults 1 / png / standard).

**Validates: Requirements 1.3, 2.1, 3.1**

## Error Handling

- **Pure utility** — `calculateCredits` does no I/O and cannot throw for in-range inputs; the UI constrains inputs to the fixed buttons, so out-of-range values are unreachable. No defensive clamping beyond the type system.
- **Credits loading** — `useCredits()` yields `balance = 0` until loaded (`creditsData?.balance ?? 0`). Since `totalCredits >= 10`, the gate stays disabled while loading (safe default).
- **Insufficient balance** — `balance < totalCredits` disables the button, shows the "Not enough credits" branch, and the helper reports `totalCredits - balance` needed; no request is sent.
- **Submission errors** — unchanged; `/api/generate` failures surface via the existing error banner. The server remains the source of truth for the actual (flat-10) deduction under D1.

## Testing Strategy

- **Unit (`calculateCredits`)** — table-driven over the cost model (10 / 20 / 15 / 13 / 18 / 72) plus the correctness properties (lower bound, linearity, additivity).
- **Component (`OutputSettingsPanel`)** — controlled-prop rendering: single active option per group, correct `on*Change` invocation on click, footer renders the passed `totalCredits`, badges (`+5`, `+3`) present.
- **Integration (`GeneratePage`)** — selection changes update the displayed total and button label; with a mocked `useCredits` balance, the enable/disable gate flips at the `balance === totalCredits` boundary; header badge text updated.
- **Build gate** — `npm run build` must pass (project rule), confirming no type regressions and that the `RecentHistoryPanel` removal left no dangling imports.

> If no test runner is configured, `npm run build` is the minimum gate; a runner (e.g. Vitest) would be added as a small prerequisite if executable tests are desired.

## Known Trade-offs / Future Work

**Estimate vs. actual charge (D1, Option A).** The Output Settings panel shows a *variable* estimate (e.g. 18, 72) and gates the Generate button on it, but the backend still deducts a **flat 10 credits** per generation. This means:

- A user selecting, say, 3D + HD + 4 variants sees "72 credits" and is gated as if it costs 72, but is only charged 10 by the server on completion.
- The "Total estimasi" is therefore an **estimate / quote**, not the authoritative charge.

This gap is **intentional and accepted** for this PR because the backend is hard out-of-scope. It is **not** fixed here and **no task** addresses billing reconciliation.

**Future PR (separate, when backend is ready):** teach `/api/generate` (and the status/deduction logic) to accept `variantCount`, `format`, and `resolution`, persist them, and deduct `calculateCredits(...)` instead of the flat 10 — plus actually generate N variants. At that point the client estimate and the server charge converge. `lib/credits.ts` is intentionally written as a standalone pure module so the future backend can import and reuse it without change.

## Constraints Honored

- Palette limited to `#F97316 / #E5E4E0 / #1A1A1A / #737373 / #A3A3A3` (+ existing amber tints).
- 12-column 4-5-3 split unchanged; center column and Live Generation Flow untouched.
- Active-state pattern (2px amber border + 10% amber tint + amber text) applied uniformly; default 1px neutral border + white.
- No AI-themed icons; no "4K" claims (uses "HD" / "Standard").
- Routing and `/history` untouched.
- **No backend touched** — no `/api/` files, no route handlers, no server actions, no new request-body params, `useCredits()` unchanged.
