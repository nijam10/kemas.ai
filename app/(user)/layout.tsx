import { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      {children}
    </div>
  );
}
