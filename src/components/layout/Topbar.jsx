import { RefreshCw, ExternalLink } from "lucide-react";
import clsx from "clsx";

export function Topbar({ cliente, onRefresh, refreshing, lastUpdate }) {
  return (
    <header className="sticky top-0 z-10 border-b border-[#F1F1F4] bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: cliente?.color_hex || "#115A36" }}
          >
            {cliente?.nombre?.[0] || "?"}
          </div>
          <div>
            <h1 className="text-base font-semibold text-black">
              {cliente?.nombre || "Cargando..."}
            </h1>
            <p className="text-xs text-[#626264] flex items-center gap-1">
              {cliente?.slug}.com
              <ExternalLink className="h-3 w-3" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="hidden sm:inline text-xs text-[#626264]">
              Actualizado {lastUpdate}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={clsx(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              "border border-[#F1F1F4] bg-white hover:bg-[#F8F8FB] text-[#333333]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <RefreshCw
              className={clsx("h-3.5 w-3.5", refreshing && "animate-spin")}
            />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>
    </header>
  );
}
