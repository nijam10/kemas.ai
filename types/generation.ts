import { PackagingType } from "./design";

export interface GenerationRequest {
  prompt: string;
  packagingType: PackagingType;
  logoFile?: File;
  userId: string;
}

export interface GenerationResponse {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  resultUrl?: string;
  error?: string;
}

export interface GenerationStatus {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress: number;
  resultUrl?: string;
  error?: string;
}
