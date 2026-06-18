import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export function ConfirmDialog({
  titulo,
  mensaje,
  textoConfirmar = "Eliminar",
  onConfirm,
  onCancel,
  peligroso = true,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirm() {
    setError(null);
    setLoading(true);
    try {
      await onConfirm();
      onCancel();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${peligroso ? "bg-[#FDEBEB]" : "bg-[#E6F5EC]"}`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${peligroso ? "text-[#B91C1C]" : "text-[#115A36]"}`}
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-black">{titulo}</h3>
            </div>
          </div>

          <p className="text-sm text-[#626264] leading-relaxed mb-4">
            {mensaje}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#FDEBEB] border border-[#F5BFBF]">
              <p className="text-xs text-[#7F1D1D]">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-[#626264] hover:bg-[#F8F8FB] rounded-lg transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition disabled:opacity-50 ${peligroso ? "bg-[#B91C1C] hover:bg-[#991919]" : "bg-[#115A36] hover:bg-[#0d4528]"}`}
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
