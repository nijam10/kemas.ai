/**
 * Kemas.ai API Client
 * Typed fetch wrappers for Phase 1 read-only API routes.
 * Each function validates the { success, data } envelope and throws
 * a clean Error on failure so hooks can catch it uniformly.
 */

// ── Response shape from every API route ──────────────────────────────────────

interface ApiOk<T> {
  success: true;
  data: T;
}

interface ApiErr {
  success: false;
  error: string;
}

type ApiResponse<T> = ApiOk<T> | ApiErr;

// ── Shared fetch helper ───────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path, {
    // next: { revalidate: 0 } keeps it fresh on every call (no stale cache)
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${path}`);
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(json.error ?? `API error from ${path}`);
  }

  return json.data;
}

// ── Types mirroring API responses ─────────────────────────────────────────────

export interface ApiGalleryTemplate {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  packagingType: string;
  previewImageUrl: string;
  promptPreset: string;
  colorMood: string | null;
  styleTags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiDesign {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  packagingType: string;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  status: string;
  creditsUsed: number;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  description: string | null;
  createdAt: string;
}

export interface ApiProfile {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  wallet: {
    balance: number;
    dailyQuota: number;
    lastResetAt: string;
  } | null;
  userProfile: {
    businessName: string | null;
    brandCategory: string | null;
    defaultPackagingType: string;
    defaultExportQuality: string;
    autoSaveGeneratedDesigns: boolean;
  } | null;
  stats: {
    totalDesigns: number;
    completedDesigns: number;
    savedDesigns: number;
  };
}

export interface ApiProfileUpdatePayload {
  businessName?: string;
  brandCategory?: string;
  defaultPackagingType?: string;
  defaultExportQuality?: string;
  autoSaveGeneratedDesigns?: boolean;
}

export interface ApiCreditBalance {
  userId: string;
  balance: number;
  dailyQuota: number;
  lastResetAt: string;
  recentTransactions: ApiCreditTransaction[];
}

export interface ApiDesignsResult {
  designs: ApiDesign[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  userId: string;
}

export interface ApiGalleryResult {
  templates: ApiGalleryTemplate[];
  total: number;
}

// ── Public API functions ──────────────────────────────────────────────────────

/**
 * GET /api/gallery
 * Returns all gallery templates, featured first.
 */
export async function getGalleryTemplates(): Promise<ApiGalleryResult> {
  return apiFetch<ApiGalleryResult>("/api/gallery");
}

/**
 * GET /api/designs
 * Returns designs for the current mock user.
 */
export async function getUserDesigns(
  params: { page?: number; pageSize?: number } = {}
): Promise<ApiDesignsResult> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  const query = qs.toString() ? `?${qs}` : "";
  return apiFetch<ApiDesignsResult>(`/api/designs${query}`);
}

/**
 * GET /api/profile
 * Returns the current user's profile + wallet + userProfile settings + stats.
 */
export async function getProfile(): Promise<ApiProfile> {
  return apiFetch<ApiProfile>("/api/profile");
}

/**
 * PATCH /api/profile
 * Saves user profile settings (upserts UserProfile row).
 */
export async function updateProfile(
  payload: ApiProfileUpdatePayload
): Promise<ApiProfile> {
  const res = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from PATCH /api/profile`);
  }

  const json: ApiResponse<ApiProfile> = await res.json();
  if (!json.success) {
    throw new Error(json.error ?? "Failed to save profile");
  }
  return json.data;
}

/**
 * GET /api/credits/balance
 * Returns the current mock user's credit balance + recent transactions.
 */
export async function getCreditBalance(): Promise<ApiCreditBalance> {
  return apiFetch<ApiCreditBalance>("/api/credits/balance");
}
