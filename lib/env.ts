/**
 * Environment variables validation and type-safe access
 */

export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",
  
  // Auth
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
  
  // RunPod
  RUNPOD_API_KEY: process.env.RUNPOD_API_KEY || "",
  RUNPOD_ENDPOINT: process.env.RUNPOD_ENDPOINT || "",
  
  // Storage
  STORAGE_BUCKET: process.env.STORAGE_BUCKET || "",
  STORAGE_REGION: process.env.STORAGE_REGION || "",
  
  // App
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

export function validateEnv() {
  // TODO: Add environment validation logic
  return true;
}
