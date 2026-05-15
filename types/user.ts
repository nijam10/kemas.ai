import { UserRole } from "./auth";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  credits: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalDesigns: number;
  creditsUsed: number;
  creditsRemaining: number;
  lastGeneratedAt?: Date;
}
