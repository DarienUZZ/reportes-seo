import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) throw error;
      setClientes(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  async function crearCliente(datos) {
    const { data, error } = await supabase
      .from("clientes")
      .insert([datos])
      .select()
      .single();
    if (error) throw error;
    await fetchClientes();
    return data;
  }

  async function actualizarCliente(id, datos) {
    const { data, error } = await supabase
      .from("clientes")
      .update(datos)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    await fetchClientes();
    return data;
  }

  async function eliminarCliente(id) {
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) throw error;
    await fetchClientes();
  }

  async function toggleActivo(id, activo) {
    return actualizarCliente(id, { activo });
  }

  return {
    clientes,
    loading,
    error,
    refetch: fetchClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    toggleActivo,
  };
}
