"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserDesigns, type ApiDesignsResult } from "@/lib/api-client";

interface UseDesignsReturn {
  data: ApiDesignsResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDesigns(): UseDesignsReturn {
  const [data, setData] = useState<ApiDesignsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUserDesigns({ pageSize: 100 });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load designs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
