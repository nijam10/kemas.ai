"use client";

import { useState, useEffect, useCallback } from "react";
import { getGalleryTemplates, type ApiGalleryResult } from "@/lib/api-client";

interface UseGalleryReturn {
  data: ApiGalleryResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGallery(): UseGalleryReturn {
  const [data, setData] = useState<ApiGalleryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getGalleryTemplates();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
