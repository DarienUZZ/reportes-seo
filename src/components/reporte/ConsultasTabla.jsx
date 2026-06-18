import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Search } from "lucide-react";
import { useState } from "react";

export function ConsultasTabla({ consultas }) {
  const [filtro, setFiltro] = useState("");
  const datos = (consultas || []).filter((c) =>
    c.consulta.toLowerCase().includes(filtro.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle>Consultas de búsqueda</CardTitle>
            <p className="text-xs text-[#626264] mt-0.5">
              Palabras clave con las que te encuentran
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#999999]" />
            <input
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar..."
              className="w-full sm:w-44 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-[#F1F1F4] bg-white focus:outline-none focus:ring-2 focus:ring-[#115A36]/20 focus:border-[#115A36]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="max-h-96 overflow-y-auto">
          {/* Desktop: tabla completa */}
          <table className="hidden sm:table w-full">
            <thead className="sticky top-0 bg-[#F8F8FB] border-y border-[#F1F1F4]">
              <tr>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-4 py-2.5">
                  Consulta
                </th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-2 py-2.5 w-16">
                  Clics
                </th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-2 py-2.5 w-16">
                  Impr.
                </th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-2 py-2.5 w-16">
                  CTR
                </th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-4 py-2.5 w-14">
                  Pos.
                </th>
              </tr>
            </thead>
            <tbody>
              {datos.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-12 text-center text-sm text-[#626264]"
                  >
                    {filtro
                      ? "No se encontraron consultas"
                      : "Sin datos de consultas"}
                  </td>
                </tr>
              ) : (
                datos.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#F1F1F4] hover:bg-[#F8F8FB] transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-black font-mono break-words">
                      {c.consulta}
                    </td>
                    <td className="px-2 py-3 text-right">
                      {c.clics > 0 ? (
                        <Badge variant="green">{c.clics}</Badge>
                      ) : (
                        <span className="text-[#999999] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-2 py-3 text-right text-xs text-[#626264]">
                      {c.impresiones}
                    </td>
                    <td className="px-2 py-3 text-right text-xs text-[#626264]">
                      {(c.ctr * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-[#626264]">
                      #{c.posicion?.toFixed(1) || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile: cards apiladas */}
          <div className="sm:hidden divide-y divide-[#F1F1F4]">
            {datos.length === 0 ? (
              <p className="py-12 text-center text-sm text-[#626264]">
                {filtro
                  ? "No se encontraron consultas"
                  : "Sin datos de consultas"}
              </p>
            ) : (
              datos.map((c) => (
                <div
                  key={c.id}
                  className="px-4 py-3 hover:bg-[#F8F8FB] transition-colors"
                >
                  <p className="text-xs text-black font-mono break-words mb-2">
                    {c.consulta}
                  </p>
                  <div className="flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-1">
                      <span className="text-[#999999]">Clics:</span>
                      {c.clics > 0 ? (
                        <Badge variant="green">{c.clics}</Badge>
                      ) : (
                        <span className="text-[#999999]">—</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#999999]">Impr:</span>
                      <span className="text-[#333333] font-medium">
                        {c.impresiones}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#999999]">CTR:</span>
                      <span className="text-[#333333] font-medium">
                        {(c.ctr * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#999999]">Pos:</span>
                      <span className="text-[#333333] font-medium">
                        #{c.posicion?.toFixed(1) || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
