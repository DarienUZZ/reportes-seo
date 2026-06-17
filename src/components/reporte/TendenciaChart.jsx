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

export function TendenciaChart({ diario }) {
  const data = (diario || []).map((d) => ({
    fecha: d.fecha,
    fechaCorta: format(parseISO(d.fecha), "d MMM", { locale: es }),
    clics: d.clics || 0,
    impresiones: d.impresiones || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tendencia diaria</CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#115A36]" />
              <span className="text-[#626264]">Clics</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#00A3BF]" />
              <span className="text-[#626264]">Impresiones</span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gClics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#115A36" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#115A36" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gImpr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00A3BF" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#00A3BF" stopOpacity={0} />
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
                  color: "#000",
                  fontSize: "12px",
                  padding: "8px 12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                labelStyle={{ color: "#626264", marginBottom: 4 }}
              />
              <Area
                type="monotone"
                dataKey="impresiones"
                stroke="#00A3BF"
                strokeWidth={2}
                fill="url(#gImpr)"
              />
              <Area
                type="monotone"
                dataKey="clics"
                stroke="#115A36"
                strokeWidth={2.5}
                fill="url(#gClics)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
