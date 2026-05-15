"use client";

import { ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * React Query provider
 * TODO: Install and configure @tanstack/react-query
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return <>{children}</>;
}
