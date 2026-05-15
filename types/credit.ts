export interface CreditBalance {
  userId: string;
  balance: number;
  lastUpdated: Date;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: "PURCHASE" | "USAGE" | "REFUND" | "ADMIN_ADJUSTMENT";
  description: string;
  createdAt: Date;
}

export interface TopUpRequest {
  userId: string;
  amount: number;
  paymentMethod: string;
}
