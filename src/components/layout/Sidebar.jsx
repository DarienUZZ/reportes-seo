import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings, Users, Sparkles } from "lucide-react";
import clsx from "clsx";

const links = [
  { to: "/cliente/rehabcanino", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin", icon: Users, label: "Clientes" },
  { to: "/admin/configuracion", icon: Settings, label: "Configuración" },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-[#F1F1F4] bg-white">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-[#F1F1F4]">
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

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#E6F5EC] text-[#115A36]"
                  : "text-[#626264] hover:text-black hover:bg-[#F8F8FB]",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-[#F1F1F4]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#259D63]" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-black truncate">Darien</p>
            <p className="text-xs text-[#999999] truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
