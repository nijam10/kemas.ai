export type PackagingType = 
  | "Pouch"
  | "Box"
  | "Bottle"
  | "Can"
  | "Sachet"
  | "Jar"
  | "Bag"
  | "Wrapper";

export type DesignStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface Design {
  id: string;
  userId: string;
  prompt: string;
  packagingType: PackagingType;
  logoUrl?: string;
  resultUrl?: string;
  status: DesignStatus;
  creditsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DesignHistory {
  designs: Design[];
  total: number;
  page: number;
  pageSize: number;
}
