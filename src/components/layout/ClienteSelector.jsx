import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Check, Search, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { useClientes } from "../../hooks/useClientes";

export function ClienteSelector({ slugActual }) {
  const { clientes, loading } = useClientes();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const clienteActual = clientes.find((c) => c.slug === slugActual);

  const filtrados = clientes.filter((c) => {
    if (!filtro) return true;
    const q = filtro.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setFiltro("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  function select(slug) {
    setOpen(false);
    setFiltro("");
    navigate(`/cliente/${slug}`);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-2.5 px-2 py-1 rounded-lg hover:bg-[#F8F8FB] transition-colors disabled:opacity-50"
      >
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-semibold text-sm shrink-0"
          style={{ backgroundColor: clienteActual?.color_hex || "#115A36" }}
        >
          {clienteActual?.nombre?.[0] || "?"}
        </div>
        <div className="text-left min-w-0">
          <p className="text-sm font-semibold text-black truncate max-w-[200px]">
            {clienteActual?.nombre || "Seleccionar cliente"}
          </p>
          <p className="text-xs text-[#626264] flex items-center gap-1 truncate">
            {clienteActual?.slug ? `${clienteActual.slug}.com` : "—"}
            {clienteActual && <ExternalLink className="h-3 w-3" />}
          </p>
        </div>
        <ChevronDown
          className={clsx(
            "h-4 w-4 text-[#999999] transition-transform shrink-0",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-[#F1F1F4] rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-[#F1F1F4]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#999999]" />
              <input
                ref={inputRef}
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Buscar cliente..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#F1F1F4] bg-[#F8F8FB] focus:outline-none focus:ring-2 focus:ring-[#115A36]/20 focus:border-[#115A36] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Lista */}
          <div className="max-h-72 overflow-y-auto py-1">
            {filtrados.length === 0 ? (
              <p className="px-4 py-6 text-xs text-center text-[#999999]">
                {filtro ? "No se encontraron clientes" : "No hay clientes"}
              </p>
            ) : (
              filtrados.map((c) => (
                <button
                  key={c.id}
                  onClick={() => select(c.slug)}
                  className={clsx(
                    "w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F8F8FB] transition-colors",
                    slugActual === c.slug && "bg-[#E6F5EC]",
                  )}
                >
                  <div
                    className="h-7 w-7 rounded-md flex items-center justify-center text-white text-xs font-semibold shrink-0"
                    style={{ backgroundColor: c.color_hex || "#115A36" }}
                  >
                    {c.nombre?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-black truncate">
                      {c.nombre}
                    </p>
                    <p className="text-[10px] text-[#999999] truncate">
                      {c.slug}.com
                    </p>
                  </div>
                  {slugActual === c.slug && (
                    <Check className="h-3.5 w-3.5 text-[#115A36] shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer con total */}
          {clientes.length > 0 && (
            <div className="px-3 py-2 border-t border-[#F1F1F4] bg-[#F8F8FB]">
              <p className="text-[10px] text-[#999999]">
                {filtrados.length} de {clientes.length} cliente
                {clientes.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
