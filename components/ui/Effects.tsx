import { ReactNode } from "react";

interface SpotlightProps {
  children: ReactNode;
  className?: string;
}

export function Spotlight({ children, className = "" }: SpotlightProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
