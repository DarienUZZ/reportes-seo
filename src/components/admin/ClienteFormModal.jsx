import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

const COLORES_SUGERIDOS = [
  "#115A36",
  "#0017C1",
  "#006F83",
  "#259D63",
  "#00A3BF",
  "#7C3AED",
  "#F59E0B",
  "#EF4444",
];

export function ClienteFormModal({ cliente, onClose, onSave }) {
  const esEdicion = !!cliente;
  const [datos, setDatos] = useState({
    slug: "",
    nombre: "",
    color_hex: "#115A36",
    ga4_property_id: "",
    activo: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cliente) {
      setDatos({
        slug: cliente.slug || "",
        nombre: cliente.nombre || "",
        color_hex: cliente.color_hex || "#115A36",
        ga4_property_id: cliente.ga4_property_id || "",
        activo: cliente.activo ?? true,
      });
    }
  }, [cliente]);

  function actualizar(campo, valor) {
    setDatos((d) => ({ ...d, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      // Limpiar slug
      const slugLimpio = datos.slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      // Asegurar formato del GA4 property ID
      let propertyId = datos.ga4_property_id.trim();
      if (propertyId && !propertyId.startsWith("properties/")) {
        propertyId = `properties/${propertyId}`;
      }

      await onSave({
        ...datos,
        slug: slugLimpio,
        ga4_property_id: propertyId,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F1F4]">
          <div>
            <h2 className="text-lg font-bold text-black">
              {esEdicion ? "Editar cliente" : "Nuevo cliente"}
            </h2>
            <p className="text-xs text-[#626264] mt-0.5">
              {esEdicion
                ? "Actualizá la información"
                : "Agregá un cliente al sistema"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F8F8FB] text-[#626264] transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="text-xs font-medium text-[#626264] uppercase tracking-wider">
              Nombre <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              required
              value={datos.nombre}
              onChange={(e) => actualizar("nombre", e.target.value)}
              placeholder="Rehab Canino"
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-[#F1F1F4] bg-white focus:outline-none focus:ring-2 focus:ring-[#115A36]/20 focus:border-[#115A36] transition"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-xs font-medium text-[#626264] uppercase tracking-wider">
              Slug (URL) <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              required
              value={datos.slug}
              onChange={(e) => actualizar("slug", e.target.value)}
              placeholder="rehabcanino"
              disabled={esEdicion}
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-[#F1F1F4] bg-white focus:outline-none focus:ring-2 focus:ring-[#115A36]/20 focus:border-[#115A36] transition disabled:bg-[#F8F8FB] disabled:cursor-not-allowed font-mono"
            />
            <p className="mt-1 text-[10px] text-[#999999]">
              URL: /cliente/{datos.slug || "mi-cliente"}
            </p>
          </div>

          {/* GA4 Property ID */}
          <div>
            <label className="text-xs font-medium text-[#626264] uppercase tracking-wider">
              GA4 Property ID
            </label>
            <input
              type="text"
              value={datos.ga4_property_id}
              onChange={(e) => actualizar("ga4_property_id", e.target.value)}
              placeholder="536665236 o properties/536665236"
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-[#F1F1F4] bg-white focus:outline-none focus:ring-2 focus:ring-[#115A36]/20 focus:border-[#115A36] transition font-mono"
            />
            <p className="mt-1 text-[10px] text-[#999999]">
              Lo encontrás en Google Analytics → Administrar → Detalles de la
              propiedad
            </p>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-medium text-[#626264] uppercase tracking-wider">
              Color identificador
            </label>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {COLORES_SUGERIDOS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => actualizar("color_hex", color)}
                  className={`h-8 w-8 rounded-lg border-2 transition ${datos.color_hex === color ? "border-black scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={datos.color_hex}
                onChange={(e) => actualizar("color_hex", e.target.value)}
                className="h-8 w-8 rounded-lg cursor-pointer border-2 border-[#F1F1F4]"
              />
            </div>
          </div>

          {/* Activo */}
          {esEdicion && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8F8FB]">
              <div>
                <p className="text-sm font-medium text-black">Cliente activo</p>
                <p className="text-xs text-[#626264]">
                  Los inactivos no aparecen en el selector
                </p>
              </div>
              <button
                type="button"
                onClick={() => actualizar("activo", !datos.activo)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${datos.activo ? "bg-[#115A36]" : "bg-[#CCCCCC]"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${datos.activo ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#FDEBEB] border border-[#F5BFBF]">
              <AlertCircle className="h-4 w-4 text-[#B91C1C] shrink-0 mt-0.5" />
              <p className="text-xs text-[#7F1D1D]">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#626264] hover:bg-[#F8F8FB] rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#115A36] hover:bg-[#0d4528] rounded-lg transition disabled:opacity-50"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {esEdicion ? "Guardar cambios" : "Crear cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
