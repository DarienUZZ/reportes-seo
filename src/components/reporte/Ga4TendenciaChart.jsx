import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function Ga4TendenciaChart({ diario }) {
  const data = (diario || []).map((d) => ({
    fecha: d.fecha,
    fechaCorta: format(parseISO(d.fecha), "d MMM", { locale: es }),
    usuarios: d.usuarios || 0,
    sesiones: d.sesiones || 0,
    paginas_vistas: d.paginas_vistas || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Tendencia diaria</CardTitle>
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#115A36]" />
              <span className="text-[#626264]">Usuarios</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#00A3BF]" />
              <span className="text-[#626264]">Sesiones</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0017C1]" />
              <span className="text-[#626264]">Páginas vistas</span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gUsuarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#115A36" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#115A36" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gSesiones" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00A3BF" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00A3BF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gVistas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0017C1" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#0017C1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F1F4"
                vertical={false}
              />
              <XAxis
                dataKey="fechaCorta"
                tick={{ fontSize: 11, fill: "#999999" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#999999" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #F1F1F4",
                  borderRadius: "8px",
                  fontSize: "12px",
                  padding: "8px 12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                labelStyle={{ color: "#626264", marginBottom: 4 }}
              />
              <Area
                type="monotone"
                dataKey="paginas_vistas"
                stroke="#0017C1"
                strokeWidth={2}
                fill="url(#gVistas)"
              />
              <Area
                type="monotone"
                dataKey="sesiones"
                stroke="#00A3BF"
                strokeWidth={2}
                fill="url(#gSesiones)"
              />
              <Area
                type="monotone"
                dataKey="usuarios"
                stroke="#115A36"
                strokeWidth={2.5}
                fill="url(#gUsuarios)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
