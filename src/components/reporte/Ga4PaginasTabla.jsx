import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FileText } from "lucide-react";

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function Ga4PaginasTabla({ paginas }) {
  const agrupadas = {};
  for (const p of paginas || []) {
    const key = p.url;
    if (!agrupadas[key]) {
      agrupadas[key] = { ...p, vistas: 0, usuarios: 0 };
    }
    agrupadas[key].vistas += p.vistas || 0;
    agrupadas[key].usuarios += p.usuarios || 0;
    if (!agrupadas[key].titulo && p.titulo) agrupadas[key].titulo = p.titulo;
  }
  const datos = Object.values(agrupadas)
    .sort((a, b) => b.vistas - a.vistas)
    .slice(0, 15);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Páginas más vistas</CardTitle>
        <p className="text-xs text-[#626264] mt-0.5">
          URLs con más tráfico en tu sitio
        </p>
      </CardHeader>
      <CardContent className="px-0">
        <div className="max-h-96 overflow-y-auto">
          {/* Desktop */}
          <table className="hidden sm:table w-full">
            <thead className="sticky top-0 bg-[#F8F8FB] border-y border-[#F1F1F4]">
              <tr>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-4 py-2.5">
                  Página
                </th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-2 py-2.5 w-20">
                  Vistas
                </th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-2 py-2.5 w-20">
                  Usuarios
                </th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-4 py-2.5 w-20">
                  Tiempo
                </th>
              </tr>
            </thead>
            <tbody>
              {datos.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-12 text-center text-sm text-[#626264]"
                  >
                    Sin datos de páginas
                  </td>
                </tr>
              ) : (
                datos.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#F1F1F4] hover:bg-[#F8F8FB] transition-colors"
                  >
                    <td className="px-4 py-3 max-w-0">
                      <p className="text-xs font-medium text-black truncate">
                        {p.titulo || p.url}
                      </p>
                      <p className="text-[10px] text-[#999999] font-mono truncate mt-0.5">
                        {p.url}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <Badge variant="green">{p.vistas}</Badge>
                    </td>
                    <td className="px-2 py-3 text-right text-xs text-[#626264]">
                      {p.usuarios}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-[#626264]">
                      {formatDuration(p.duracion_media)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile */}
          <div className="sm:hidden divide-y divide-[#F1F1F4]">
            {datos.length === 0 ? (
              <p className="py-12 text-center text-sm text-[#626264]">
                Sin datos de páginas
              </p>
            ) : (
              datos.map((p) => (
                <div key={p.id} className="px-4 py-3">
                  <div className="flex items-start gap-2 mb-2 min-w-0">
                    <FileText className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#999999]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-black break-words">
                        {p.titulo || p.url}
                      </p>
                      <p className="text-[10px] text-[#999999] font-mono break-all mt-0.5">
                        {p.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px] ml-5 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="text-[#999999]">Vistas:</span>
                      <Badge variant="green">{p.vistas}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#999999]">Usuarios:</span>
                      <span className="text-[#333333] font-medium">
                        {p.usuarios}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#999999]">Tiempo:</span>
                      <span className="text-[#333333] font-medium">
                        {formatDuration(p.duracion_media)}
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
