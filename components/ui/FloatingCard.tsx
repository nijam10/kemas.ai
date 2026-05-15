import { ReactNode } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  rotate?: number;
}

export function FloatingCard({ children, className = "", delay = 0, rotate = 0 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ delay, duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
