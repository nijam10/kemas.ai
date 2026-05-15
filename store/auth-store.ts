/**
 * Authentication state management
 * TODO: Integrate with Zustand or other state management
 */

import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Placeholder store
export const authStore: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};
