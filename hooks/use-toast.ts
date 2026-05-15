"use client";

import { useState, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

/**
 * Simple toast notification hook
 * TODO: Integrate with a proper toast library like sonner or react-hot-toast
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return {
    toast,
    toasts,
    success: (message: string) => toast(message, "success"),
    error: (message: string) => toast(message, "error"),
    info: (message: string) => toast(message, "info"),
    warning: (message: string) => toast(message, "warning"),
  };
}
