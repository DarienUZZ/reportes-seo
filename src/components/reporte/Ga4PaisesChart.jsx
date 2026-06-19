import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { getFlag } from "../../lib/flags";

export function Ga4PaisesChart({ paises }) {
  const data = (paises || []).slice(0, 8);
  const maxSesiones = Math.max(...data.map((p) => p.sesiones), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Países (GA4)</CardTitle>
        <p className="text-xs text-[#626264] mt-0.5">
          De dónde visitan tu sitio
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {data.length === 0 && (
            <p className="text-sm text-[#626264] py-8 text-center">
              Sin datos de países
            </p>
          )}
          {data.map((p) => {
            const codigo = p.cat_paises?.codigo;
            const nombre = p.cat_paises?.nombre || "Desconocido";
            const pct = (p.sesiones / maxSesiones) * 100;
            return (
              <div key={p.id}>
                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">
                      {getFlag(codigo)}
                    </span>
                    <span className="text-sm font-medium text-black truncate">
                      {nombre}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 shrink-0">
                    <span className="text-sm font-semibold text-black">
                      {p.sesiones}
                    </span>
                    <span className="text-xs text-[#626264]">
                      / {p.usuarios} usr
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[#F1F1F4] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0017C1] to-[#00A3BF] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
