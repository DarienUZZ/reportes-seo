import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  async function actualizarUsuario(id, datos) {
    const { error } = await supabase
      .from("usuarios")
      .update(datos)
      .eq("id", id);
    if (error) throw error;
    await fetchUsuarios();
  }

  async function toggleActivo(id, activo) {
    return actualizarUsuario(id, { activo });
  }

  async function cambiarRol(id, rol) {
    return actualizarUsuario(id, { rol });
  }

  return {
    usuarios,
    loading,
    error,
    refetch: fetchUsuarios,
    actualizarUsuario,
    toggleActivo,
    cambiarRol,
  };
}
