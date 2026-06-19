import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Users,
  Sparkles,
  LogOut,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../../hooks/useAuth";

export function Sidebar({ mobileOpen, onMobileClose }) {
  const { profile, signOut, isAdmin } = useAuth();

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between gap-2 px-5 py-5 border-b border-[#F1F1F4]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#115A36]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-black">SEO Dashboard</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider">
              v1.0
            </p>
          </div>
        </div>
        {/* Botón cerrar en móvil */}
        <button
          onClick={onMobileClose}
          className="md:hidden p-1.5 rounded-lg hover:bg-[#F8F8FB] text-[#626264] transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink
          to="/"
          end
          onClick={onMobileClose}
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-[#E6F5EC] text-[#115A36]"
                : "text-[#626264] hover:text-black hover:bg-[#F8F8FB]",
            )
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </NavLink>

        {isAdmin && (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#999999] px-2 mb-2 mt-5">
              Administración
            </p>
            <NavLink
              to="/admin"
              end
              onClick={onMobileClose}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#E6F5EC] text-[#115A36]"
                    : "text-[#626264] hover:text-black hover:bg-[#F8F8FB]",
                )
              }
            >
              <Users className="h-4 w-4" />
              Clientes
            </NavLink>
            <NavLink
              to="/admin/configuracion"
              onClick={onMobileClose}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#E6F5EC] text-[#115A36]"
                    : "text-[#626264] hover:text-black hover:bg-[#F8F8FB]",
                )
              }
            >
              <Settings className="h-4 w-4" />
              Configuración
            </NavLink>
          </>
        )}
      </nav>

      <div className="px-3 py-3 border-t border-[#F1F1F4]">
        {profile ? (
          <div className="flex items-center gap-3 p-2">
            <div className="h-8 w-8 rounded-full bg-[#259D63] flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {profile.nombre?.[0]?.toUpperCase() ||
                profile.email?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-black truncate">
                {profile.nombre || profile.email}
              </p>
              <p className="text-xs text-[#999999] truncate capitalize">
                {profile.rol}
              </p>
            </div>
            <button
              onClick={signOut}
              className="p-1.5 rounded-md hover:bg-[#F8F8FB] text-[#999999] hover:text-[#333333] transition"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            onClick={onMobileClose}
            className="block px-3 py-2 text-sm text-center text-[#115A36] font-medium hover:bg-[#F8F8FB] rounded-lg transition"
          >
            Iniciar sesión
          </NavLink>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-[#F1F1F4] bg-white">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={clsx(
          "md:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white border-r border-[#F1F1F4] transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
