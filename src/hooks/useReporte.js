import { useState, useEffect, useCallback } from "react";
import { getReporte } from "../lib/api";

export function useReporte({ slug, anio, mes }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        const result = await getReporte({ slug, anio, mes, refresh });
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [slug, anio, mes],
  );

  useEffect(() => {
    if (slug) fetchData(false);
  }, [slug, anio, mes, fetchData]);

  return { data, loading, error, refreshing, refresh: () => fetchData(true) };
}
