/**
 * Kemas.ai — ComfyUI Workflow Helper
 *
 * Loads workflows/kemas-packaging-api.json and injects user inputs
 * before submission to ComfyUI.
 *
 * Node map (identified from the real workflow JSON):
 *   "29"  — CLIPTextEncode  → positive prompt text
 *   "30"  — CLIPTextEncode  → negative prompt (fixed, not injected)
 *   "28"  — KSampler        → seed (randomised per generation)
 *   "57"  — LoadImage       → logo filename (uploaded to ComfyUI input folder)
 *   "54"  — KemasSmartLogoPlacement → custom node, no injection needed
 *   "62"  — SaveImage       → final output node (used to retrieve image via /history)
 *
 * The workflow uses Flux1-dev-fp8 + KemasAI_Final LoRA.
 * Output resolution: 768 × 1024.
 */

import { readFileSync } from "fs";
import { join } from "path";

// ── Node IDs (from real workflow JSON) ───────────────────────────────────────

const POSITIVE_PROMPT_NODE = "29";
const KSAMPLER_NODE = "28";
const LOGO_LOAD_NODE = "57";

// Default logo filename used when no logo is uploaded
const DEFAULT_LOGO_FILENAME = "logo-removebg-preview.png";

// ── Packaging type → descriptive phrase ──────────────────────────────────────

const PACKAGING_LABELS: Record<string, string> = {
  STANDING_POUCH: "standing pouch packaging bag",
  PILLOW_POUCH: "pillow pouch packaging bag",
  BOX: "box packaging",
  JAR: "jar packaging",
  BOTTLE: "bottle packaging",
  SACHET: "sachet packaging",
};

// ── Load workflow ─────────────────────────────────────────────────────────────

function loadWorkflow(): Record<string, unknown> {
  const workflowPath =
    process.env.COMFYUI_WORKFLOW_PATH ??
    join(process.cwd(), "workflows", "kemas-packaging-api.json");

  try {
    const raw = readFileSync(workflowPath, "utf-8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (err) {
    throw new Error(
      `Failed to load ComfyUI workflow from ${workflowPath}: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

// ── buildWorkflow ─────────────────────────────────────────────────────────────

export interface WorkflowInput {
  /** User's raw prompt text (min 10 chars) */
  prompt: string;
  /** Prisma PackagingType enum value, e.g. "STANDING_POUCH" */
  packagingType: string;
  /** Optional business name for context */
  businessName?: string | null;
  /** Optional brand category for context */
  brandCategory?: string | null;
  /**
   * Filename of the uploaded logo in ComfyUI's input folder.
   * If null/undefined, falls back to DEFAULT_LOGO_FILENAME.
   */
  logoFilename?: string | null;
}

/**
 * Build a ready-to-submit ComfyUI workflow by injecting user inputs.
 * Returns a deep copy — the original template is never mutated.
 */
export function buildWorkflow(input: WorkflowInput): Record<string, unknown> {
  const template = loadWorkflow();

  // Deep clone
  const wf = JSON.parse(JSON.stringify(template)) as Record<
    string,
    { inputs?: Record<string, unknown>; class_type?: string; _meta?: unknown }
  >;

  // ── 1. Build enriched positive prompt ────────────────────────────────────
  const packagingLabel =
    PACKAGING_LABELS[input.packagingType] ?? "packaging";

  const contextParts: string[] = [];
  if (input.businessName) contextParts.push(`for ${input.businessName}`);
  if (input.brandCategory) contextParts.push(`${input.brandCategory} brand`);
  const context =
    contextParts.length > 0 ? `, ${contextParts.join(", ")}` : "";

  const enrichedPrompt =
    `Professional, high-resolution, perfectly focused 3D product mockup photography of a single ${packagingLabel}${context}. ` +
    `${input.prompt}. ` +
    `Clean studio background, soft drop shadow, crisp directional lighting, matte foil texture, zero blur, high-fidelity edges.`;

  // ── 2. Inject into positive prompt node (29) ─────────────────────────────
  const promptNode = wf[POSITIVE_PROMPT_NODE];
  if (promptNode?.inputs) {
    promptNode.inputs["text"] = enrichedPrompt;
  }

  // ── 3. Randomise seed in KSampler node (28) ───────────────────────────────
  const samplerNode = wf[KSAMPLER_NODE];
  if (samplerNode?.inputs) {
    samplerNode.inputs["seed"] = Math.floor(Math.random() * 2 ** 32);
  }

  // ── 4. Inject logo filename into LoadImage node (57) ─────────────────────
  const logoNode = wf[LOGO_LOAD_NODE];
  if (logoNode?.inputs) {
    logoNode.inputs["image"] =
      input.logoFilename ?? DEFAULT_LOGO_FILENAME;
  }

  return wf as Record<string, unknown>;
}
