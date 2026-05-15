"use client";

import { useState, useEffect, useCallback } from "react";
import { getCreditBalance, type ApiCreditBalance } from "@/lib/api-client";

interface UseCreditsReturn {
  data: ApiCreditBalance | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCredits(): UseCreditsReturn {
  const [data, setData] = useState<ApiCreditBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCreditBalance();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load credits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
