"use client";

import { ReactNode } from "react";

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Main application provider
 * Wraps all client-side providers
 */
export function AppProvider({ children }: AppProviderProps) {
  return <>{children}</>;
}
