"use client";

import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider for dark/light mode
 * TODO: Implement theme switching if needed
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>;
}
