/**
 * Application-wide constants
 */

export const APP_NAME = "Kemas.ai";
export const APP_DESCRIPTION = "AI-powered packaging design for Indonesian UMKM";

// Credits
export const FREE_CREDITS = 40;
export const CREDIT_PER_GENERATION = 1;

// File upload
export const MAX_FILE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

// Generation
export const MAX_PROMPT_LENGTH = 500;
export const GENERATION_TIMEOUT_MS = 120000; // 2 minutes

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Packaging types
export const PACKAGING_TYPES = [
  "Pouch",
  "Box",
  "Bottle",
  "Can",
  "Sachet",
  "Jar",
  "Bag",
  "Wrapper",
] as const;
