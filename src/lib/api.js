const WORKER_URL = import.meta.env.VITE_WORKER_URL;

export async function getReporte({ slug, anio, mes, refresh = false }) {
  const params = new URLSearchParams({ cliente: slug });
  if (anio) params.set("anio", anio);
  if (mes) params.set("mes", mes);
  if (refresh) params.set("refresh", "true");

  const res = await fetch(`${WORKER_URL}/?${params}`);
  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error || `Error ${res.status}`);
  }
  return res.json();
}
