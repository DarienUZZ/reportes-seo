import {
  Users,
  Activity,
  FileText,
  Clock,
  TrendingDown,
  Zap,
} from "lucide-react";

function MetricaCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#F1F1F4] bg-white p-5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-[#626264] uppercase tracking-wider">
          {label}
        </p>
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-black tracking-tight">{value}</p>
      {sub && <p className="text-xs text-[#626264] mt-1">{sub}</p>}
    </div>
  );
}

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function Ga4MetricasCards({ resumen }) {
  if (!resumen) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricaCard
        label="Usuarios"
        value={resumen.usuarios?.toLocaleString() ?? "0"}
        icon={Users}
        color="#115A36"
        sub={`${resumen.usuarios_nuevos?.toLocaleString() ?? 0} nuevos`}
      />
      <MetricaCard
        label="Sesiones"
        value={resumen.sesiones?.toLocaleString() ?? "0"}
        icon={Activity}
        color="#00A3BF"
        sub="Visitas totales"
      />
      <MetricaCard
        label="Páginas vistas"
        value={resumen.paginas_vistas?.toLocaleString() ?? "0"}
        icon={FileText}
        color="#0017C1"
        sub="Total de cargas"
      />
      <MetricaCard
        label="Duración media"
        value={formatDuration(resumen.duracion_media_segundos)}
        icon={Clock}
        color="#259D63"
        sub="Por sesión"
      />
      <MetricaCard
        label="Tasa de rebote"
        value={`${((resumen.tasa_rebote ?? 0) * 100).toFixed(1)}%`}
        icon={TrendingDown}
        color="#F59E0B"
        sub="Se van sin interactuar"
      />
      <MetricaCard
        label="Eventos"
        value={resumen.eventos?.toLocaleString() ?? "0"}
        icon={Zap}
        color="#7C3AED"
        sub="Acciones registradas"
      />
    </div>
  );
}
