"use client";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Spotlight({ children, className }: { children: React.ReactNode; className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouse}
      onMouseLeave={() => setOpacity(0)}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(228,171,90,0.07), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

export function MovingBorder({
  children,
  className,
  containerClassName,
  borderColor = "rgba(228,171,90,0.5)",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderColor?: string;
}) {
  return (
    <div className={cn("relative rounded-2xl p-[1px] overflow-hidden group", containerClassName)}>
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `conic-gradient(from var(--angle, 0deg), transparent 70%, ${borderColor})`,
          animation: "spin 3s linear infinite",
        }}
      />
      <div className={cn("relative rounded-2xl bg-white", className)}>
        {children}
      </div>
    </div>
  );
}

export function GradientOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute rounded-full blur-3xl opacity-20 pointer-events-none",
        className
      )}
      style={{
        background: "radial-gradient(circle, #E4AB5A 0%, transparent 70%)",
      }}
    />
  );
}

export function DotPattern({ className }: { className?: string }) {
  return (
    <svg
      className={cn("absolute inset-0 h-full w-full pointer-events-none", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dotPattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotPattern)" />
    </svg>
  );
}
