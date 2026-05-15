import { User } from "./auth";
import { Design } from "./design";

export interface AdminStats {
  totalUsers: number;
  totalDesigns: number;
  totalCreditsUsed: number;
  activeUsers: number;
  revenueThisMonth: number;
}

export interface UserManagement extends User {
  isBanned: boolean;
  isSuspended: boolean;
  totalDesigns: number;
  totalCreditsUsed: number;
}

export interface ModerationItem {
  id: string;
  type: "PROMPT" | "DESIGN";
  content: string;
  userId: string;
  userName: string;
  designId?: string;
  imageUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}
