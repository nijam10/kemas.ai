import { ReactNode } from "react";

// Auth pages (login, forgot-password) are full-screen by design.
// Do NOT add any wrapper here — the login page manages its own layout.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
