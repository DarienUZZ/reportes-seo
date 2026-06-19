import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Search, Globe, Link, Megaphone, Mail, Share2 } from "lucide-react";

const CANAL_CONFIG = {
  "Organic Search": {
    icon: Search,
    color: "#115A36",
    label: "Búsqueda orgánica",
  },
  "Paid Search": {
    icon: Megaphone,
    color: "#F59E0B",
    label: "Búsqueda pagada",
  },
  Direct: { icon: Link, color: "#0017C1", label: "Directo" },
  "Organic Social": { icon: Share2, color: "#7C3AED", label: "Redes sociales" },
  "Paid Social": { icon: Share2, color: "#EC4899", label: "Social pagado" },
  Referral: { icon: Globe, color: "#00A3BF", label: "Referidos" },
  Email: { icon: Mail, color: "#06B6D4", label: "Email" },
  Display: { icon: Megaphone, color: "#F43F5E", label: "Display" },
  Video: { icon: Megaphone, color: "#EAB308", label: "Video" },
  "Cross-network": { icon: Globe, color: "#666666", label: "Cross-network" },
  Unassigned: { icon: Globe, color: "#999999", label: "Sin clasificar" },
};

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function Ga4CanalesChart({ canales }) {
  const data = canales || [];
  const totalSesiones = data.reduce((s, c) => s + (c.sesiones || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuentes de tráfico</CardTitle>
        <p className="text-xs text-[#626264] mt-0.5">
          De dónde vienen tus visitantes
        </p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-[#626264] py-8 text-center">
            Sin datos de canales
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((c) => {
              const config = CANAL_CONFIG[c.canal] || {
                icon: Globe,
                color: "#666666",
                label: c.canal,
              };
              const Icon = config.icon;
              const pct =
                totalSesiones > 0 ? (c.sesiones / totalSesiones) * 100 : 0;

              return (
                <div key={c.id} className="min-w-0">
                  <div className="flex items-start gap-3 mb-1.5">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${config.color}15`,
                        color: config.color,
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-medium text-black truncate">
                          {config.label}
                        </p>
                        <div className="flex items-baseline gap-2 shrink-0">
                          <span className="text-sm font-semibold text-black">
                            {c.sesiones}
                          </span>
                          <span className="text-xs text-[#999999]">
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#999999] mt-0.5">
                        {c.usuarios} usuarios ·{" "}
                        {formatDuration(c.duracion_media)} promedio
                      </p>
                      <div className="h-1.5 rounded-full bg-[#F1F1F4] overflow-hidden mt-2">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: config.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
