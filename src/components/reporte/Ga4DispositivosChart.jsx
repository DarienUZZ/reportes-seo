import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Smartphone, Monitor, Tablet } from "lucide-react";

const COLORS = { MOBILE: "#0017C1", DESKTOP: "#00A3BF", TABLET: "#51B883" };
const ICONS = { MOBILE: Smartphone, DESKTOP: Monitor, TABLET: Tablet };

export function Ga4DispositivosChart({ dispositivos }) {
  const data = (dispositivos || []).map((d) => ({
    nombre: d.cat_dispositivos?.nombre || "Desconocido",
    sesiones: d.sesiones || 0,
    usuarios: d.usuarios || 0,
  }));
  const totalSesiones = data.reduce((s, d) => s + d.sesiones, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispositivos (GA4)</CardTitle>
        <p className="text-xs text-[#626264] mt-0.5">Cómo acceden a tu sitio</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="h-32 w-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="sesiones"
                  innerRadius={36}
                  outerRadius={56}
                  paddingAngle={2}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={COLORS[entry.nombre] || "#CCCCCC"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #F1F1F4",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-3">
            {data.length === 0 ? (
              <p className="text-sm text-[#626264] py-4">Sin datos</p>
            ) : (
              data.map((d) => {
                const Icon = ICONS[d.nombre];
                const pct =
                  totalSesiones > 0
                    ? Math.round((d.sesiones / totalSesiones) * 100)
                    : 0;
                return (
                  <div key={d.nombre} className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${COLORS[d.nombre]}15`,
                        color: COLORS[d.nombre],
                      }}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-medium text-black capitalize">
                          {d.nombre.toLowerCase()}
                        </p>
                        <p className="text-sm font-semibold text-black">
                          {d.sesiones}
                        </p>
                      </div>
                      <p className="text-xs text-[#626264]">
                        {d.usuarios} usuarios · {pct}%
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
