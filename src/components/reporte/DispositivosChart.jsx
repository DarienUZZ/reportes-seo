import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Smartphone, Monitor, Tablet } from "lucide-react";

const COLORS = { MOBILE: "#115A36", DESKTOP: "#00A3BF", TABLET: "#51B883" };
const ICONS = { MOBILE: Smartphone, DESKTOP: Monitor, TABLET: Tablet };

export function DispositivosChart({ dispositivos }) {
  const data = (dispositivos || []).map((d) => ({
    nombre: d.cat_dispositivos?.nombre || "Desconocido",
    clics: d.clics || 0,
    impresiones: d.impresiones || 0,
  }));
  const totalClics = data.reduce((s, d) => s + d.clics, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispositivos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="h-32 w-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="clics"
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
            {data.map((d) => {
              const Icon = ICONS[d.nombre];
              const pct =
                totalClics > 0 ? Math.round((d.clics / totalClics) * 100) : 0;
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
                        {d.clics}
                      </p>
                    </div>
                    <p className="text-xs text-[#626264]">
                      {d.impresiones} impresiones · {pct}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
