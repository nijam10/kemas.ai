/**
 * Output settings credit calculation.
 *
 * Pure module — no React, DOM, or I/O — so it can be reused unchanged by a
 * future backend that accepts output-settings parameters. For now the server
 * still deducts a flat 10 credits per generation; the value returned here is a
 * client-side estimate that drives the affordability gate and button label only.
 *
 * Cost model: BASE_CREDITS + format_premium + resolution_premium
 */

export type OutputFormat = "2d" | "3d";
export type Resolution = "standard" | "hd";

export interface CreditCalcOptions {
  format: OutputFormat;
  resolution: Resolution;
}

/** Base cost per generation. */
export const BASE_CREDITS = 10;
/** Extra credits for the 3D mockup format. */
export const FORMAT_3D_PREMIUM = 5;
/** Extra credits for HD resolution. */
export const RESOLUTION_HD_PREMIUM = 3;

/**
 * Returns the estimated credit cost for the given output settings.
 *
 * @example calculateCredits({ format: "2d", resolution: "standard" }) // 10
 * @example calculateCredits({ format: "3d", resolution: "hd" })       // 18
 */
export function calculateCredits({
  format,
  resolution,
}: CreditCalcOptions): number {
  const formatPremium = format === "3d" ? FORMAT_3D_PREMIUM : 0;
  const resolutionPremium = resolution === "hd" ? RESOLUTION_HD_PREMIUM : 0;
  return BASE_CREDITS + formatPremium + resolutionPremium;
}
