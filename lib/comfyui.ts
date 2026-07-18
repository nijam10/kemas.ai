/**
 * Kemas.ai — ComfyUI Client
 *
 * Communicates with a ComfyUI instance (Kaggle / ngrok tunnel).
 *
 * Environment variables:
 *   COMFYUI_BASE_URL   — e.g. https://abc123.ngrok-free.app  (no trailing slash)
 *   COMFYUI_CLIENT_ID  — arbitrary string used as client_id in requests
 *   COMFYUI_API_KEY    — optional Bearer token if the tunnel requires auth
 *
 * ComfyUI API endpoints used:
 *   POST /prompt                          — submit workflow
 *   GET  /history/{promptId}              — poll job status + output filenames
 *   GET  /view?filename=&subfolder=&type= — download/proxy an output image
 *   POST /upload/image                    — upload logo to ComfyUI input folder
 *   GET  /queue                           — (optional) check queue depth
 *
 * Output node: "62" (SaveImage after KemasSmartLogoPlacement)
 */

// ── Config ────────────────────────────────────────────────────────────────────

function getBaseUrl(): string {
  const url = process.env.COMFYUI_BASE_URL;
  if (!url) throw new ComfyUIConfigError("COMFYUI_BASE_URL is not set");
  return url.replace(/\/$/, "");
}

function getClientId(): string {
  return process.env.COMFYUI_CLIENT_ID ?? "kemas-ai-server";
}

function buildHeaders(extra?: Record<string, string>): HeadersInit {
  const headers: Record<string, string> = { 
    "ngrok-skip-browser-warning": "69420",
    ...(extra ?? {}) 
  };
  const key = process.env.COMFYUI_API_KEY;
  if (key) headers["Authorization"] = `Bearer ${key}`;
  return headers;
}

// ── Custom errors ─────────────────────────────────────────────────────────────

export class ComfyUIConfigError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "ComfyUIConfigError";
  }
}

export class ComfyUIUnavailableError extends Error {
  constructor(msg = "ComfyUI server is unavailable") {
    super(msg);
    this.name = "ComfyUIUnavailableError";
  }
}

export class ComfyUIWorkflowError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "ComfyUIWorkflowError";
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ComfyUISubmitResult {
  promptId: string;
  number: number;
}

export interface ComfyUIOutputImage {
  filename: string;
  subfolder: string;
  type: string;
  nodeId?: string;
}

export type ComfyUIJobStatus =
  | { status: "QUEUED" }
  | { status: "RUNNING" }
  | { status: "COMPLETED"; images: ComfyUIOutputImage[] }
  | { status: "FAILED"; error: string };

export interface ComfyUIUploadResult {
  /** Filename as stored in ComfyUI's input folder */
  filename: string;
  subfolder: string;
  type: string;
}

// ── Core fetch with timeout ───────────────────────────────────────────────────

async function comfyFetch(
  path: string,
  options: RequestInit = {},
  timeoutMs = 20_000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${getBaseUrl()}${path}`, {
      ...options,
      headers: {
        ...buildHeaders(),
        ...(options.headers as Record<string, string> | undefined ?? {}),
      },
      signal: controller.signal,
    });
    return res;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ComfyUIUnavailableError(
        `ComfyUI request timed out after ${timeoutMs}ms (${path})`
      );
    }
    throw new ComfyUIUnavailableError(
      `Cannot reach ComfyUI at ${process.env.COMFYUI_BASE_URL}${path}: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  } finally {
    clearTimeout(timer);
  }
}

// ── uploadLogo ────────────────────────────────────────────────────────────────

/**
 * Upload a logo file to ComfyUI's input folder via POST /upload/image.
 * Returns the filename as stored by ComfyUI (may differ from original name).
 *
 * @param fileBuffer  Raw file bytes
 * @param filename    Original filename (e.g. "logo.png")
 * @param mimeType    MIME type (e.g. "image/png")
 */
export async function uploadLogo(
  fileBuffer: Buffer,
  filename: string,
  mimeType = "image/png"
): Promise<ComfyUIUploadResult> {
  const formData = new FormData();
  // Convert Buffer to Uint8Array for cross-runtime Blob compatibility
  const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
  formData.append("image", blob, filename);
  formData.append("type", "input");
  formData.append("overwrite", "true");

  // Don't set Content-Type header — let fetch set it with the boundary
  const res = await comfyFetch(
    "/upload/image",
    {
      method: "POST",
      headers: buildHeaders(), // no Content-Type — FormData sets it
      body: formData,
    },
    30_000
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ComfyUIUnavailableError(
      `ComfyUI /upload/image returned HTTP ${res.status}: ${text.slice(0, 200)}`
    );
  }

  let json: { name?: string; subfolder?: string; type?: string };
  try {
    json = await res.json();
  } catch {
    throw new ComfyUIUnavailableError(
      "ComfyUI /upload/image returned non-JSON"
    );
  }

  if (!json.name) {
    throw new ComfyUIUnavailableError(
      `ComfyUI /upload/image did not return a filename: ${JSON.stringify(json)}`
    );
  }

  return {
    filename: json.name,
    subfolder: json.subfolder ?? "",
    type: json.type ?? "input",
  };
}

// ── submitPrompt ──────────────────────────────────────────────────────────────

/**
 * Submit a ComfyUI API-format workflow.
 * Returns the prompt_id assigned by ComfyUI.
 */
export async function submitPrompt(
  workflow: Record<string, unknown>
): Promise<ComfyUISubmitResult> {
  const body = {
    prompt: workflow,
    client_id: getClientId(),
  };

  const res = await comfyFetch("/prompt", {
    method: "POST",
    headers: { ...buildHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 400) {
      throw new ComfyUIWorkflowError(
        `Invalid workflow: ${text.slice(0, 400)}`
      );
    }
    throw new ComfyUIUnavailableError(
      `ComfyUI /prompt returned HTTP ${res.status}: ${text.slice(0, 200)}`
    );
  }

  let json: { prompt_id?: string; number?: number; error?: string };
  try {
    json = await res.json();
  } catch {
    throw new ComfyUIUnavailableError(
      "ComfyUI /prompt returned non-JSON"
    );
  }

  if (!json.prompt_id) {
    throw new ComfyUIWorkflowError(
      `ComfyUI did not return a prompt_id: ${JSON.stringify(json).slice(0, 200)}`
    );
  }

  return { promptId: json.prompt_id, number: json.number ?? 0 };
}

// ── getHistory ────────────────────────────────────────────────────────────────

/**
 * Poll ComfyUI /history/{promptId} to get job status and output images.
 *
 * Only images from SaveImage nodes appear in history outputs.
 * Our SaveImage node is "62" (kemas_output prefix).
 */
export async function getHistory(promptId: string): Promise<ComfyUIJobStatus> {
  const res = await comfyFetch(
    `/history/${encodeURIComponent(promptId)}`,
    {},
    15_000
  );

  if (res.status === 404) {
    return { status: "QUEUED" };
  }

  if (!res.ok) {
    throw new ComfyUIUnavailableError(
      `ComfyUI /history returned HTTP ${res.status}`
    );
  }

  let json: Record<string, unknown>;
  try {
    json = await res.json();
  } catch {
    throw new ComfyUIUnavailableError("ComfyUI /history returned non-JSON");
  }

  const entry = json[promptId] as
    | {
        status?: { status_str?: string; completed?: boolean };
        outputs?: Record<string, { images?: ComfyUIOutputImage[] }>;
      }
    | undefined;

  if (!entry) return { status: "QUEUED" };

  const statusStr = entry.status?.status_str ?? "";
  const completed = entry.status?.completed ?? false;

  if (statusStr === "error") {
    return {
      status: "FAILED",
      error: "ComfyUI reported an error for this job",
    };
  }

  if (!completed) return { status: "RUNNING" };

  // Collect all image outputs and tag them with their node ID
  const images: ComfyUIOutputImage[] = [];
  if (entry.outputs) {
    for (const [nodeId, nodeOutput] of Object.entries(entry.outputs)) {
      if (nodeOutput.images) {
        images.push(...nodeOutput.images.map(img => ({ ...img, nodeId })));
      }
    }
  }

  // Prefer images with "kemas_output" prefix (our SaveImage node) if any exist
  const kemasImages = images.filter((img) =>
    img.filename.startsWith("kemas_output")
  );
  const finalImages = kemasImages.length > 0 ? kemasImages : images;

  return { status: "COMPLETED", images: finalImages };
}

// ── getImageUrl ───────────────────────────────────────────────────────────────

/**
 * Build the public URL to view/download an output image from ComfyUI.
 */
export function getImageUrl(image: ComfyUIOutputImage): string {
  const base = getBaseUrl();
  const params = new URLSearchParams({
    filename: image.filename,
    subfolder: image.subfolder,
    type: image.type,
  });
  return `${base}/view?${params.toString()}`;
}

// ── getQueueStatus ────────────────────────────────────────────────────────────

/**
 * Check if a prompt is still in the pending/running queue.
 */
export async function getQueueStatus(promptId: string): Promise<boolean> {
  try {
    const res = await comfyFetch("/queue", {}, 10_000);
    if (!res.ok) return false;
    const json = await res.json() as {
      queue_running?: [number, string, unknown, unknown][];
      queue_pending?: [number, string, unknown, unknown][];
    };
    const running = json.queue_running ?? [];
    const pending = json.queue_pending ?? [];
    return (
      running.some((item) => item[1] === promptId) ||
      pending.some((item) => item[1] === promptId)
    );
  } catch {
    return false;
  }
}
