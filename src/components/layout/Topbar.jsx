import { RefreshCw, Menu } from "lucide-react";
import clsx from "clsx";
import { ClienteSelector } from "./ClienteSelector";

export function Topbar({
  slugActual,
  onRefresh,
  refreshing,
  lastUpdate,
  onMenuClick,
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-[#F1F1F4] bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Hamburguesa móvil */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg hover:bg-[#F8F8FB] text-[#333333] transition shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="min-w-0">
            <ClienteSelector slugActual={slugActual} />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {lastUpdate && (
            <span className="hidden sm:inline text-xs text-[#626264]">
              Actualizado {lastUpdate}
            </span>
          )}
          {onRefresh && (
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
              <span className="hidden sm:inline">
                {refreshing ? "Actualizando..." : "Actualizar"}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
