import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ExternalLink } from "lucide-react";

function formatUrl(url) {
  try {
    const u = new URL(url);
    return {
      path: u.pathname === "/" ? "/ (inicio)" : u.pathname,
      host: u.hostname,
    };
  } catch {
    return { path: url, host: "" };
  }
}

export function PaginasTabla({ paginas }) {
  const datos = paginas || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Páginas principales</CardTitle>
        <p className="text-xs text-[#626264] mt-0.5">
          URLs con más tráfico desde Google
        </p>
      </CardHeader>
      <CardContent className="px-0">
        <div className="max-h-80 overflow-y-auto">
          {/* Desktop: tabla */}
          <table className="hidden sm:table w-full">
            <thead className="sticky top-0 bg-[#F8F8FB] border-y border-[#F1F1F4]">
              <tr>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-4 py-2.5">
                  URL
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
                    Sin datos de páginas
                  </td>
                </tr>
              ) : (
                datos.map((p) => {
                  const { path, host } = formatUrl(p.url);
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-[#F1F1F4] hover:bg-[#F8F8FB] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-start gap-1.5 text-xs text-black hover:text-[#0017C1] transition-colors"
                        >
                          <span className="font-medium break-all">{path}</span>
                          <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition mt-0.5" />
                        </a>
                        <p className="text-[10px] text-[#999999] font-mono mt-0.5 truncate">
                          {host}
                        </p>
                      </td>
                      <td className="px-2 py-3 text-right">
                        {p.clics > 0 ? (
                          <Badge variant="green">{p.clics}</Badge>
                        ) : (
                          <span className="text-[#999999] text-xs">—</span>
                        )}
                      </td>
                      <td className="px-2 py-3 text-right text-xs text-[#626264]">
                        {p.impresiones}
                      </td>
                      <td className="px-2 py-3 text-right text-xs text-[#626264]">
                        {(p.ctr * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-[#626264]">
                        #{p.posicion?.toFixed(1) || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Mobile: cards apiladas */}
          <div className="sm:hidden divide-y divide-[#F1F1F4]">
            {datos.length === 0 ? (
              <p className="py-12 text-center text-sm text-[#626264]">
                Sin datos de páginas
              </p>
            ) : (
              datos.map((p) => {
                const { path, host } = formatUrl(p.url);
                return (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    key={p.id}
                    className="block px-4 py-3 hover:bg-[#F8F8FB] transition-colors"
                  >
                    <div className="flex items-start gap-1.5 mb-1">
                      <span className="text-xs font-medium text-black break-all">
                        {path}
                      </span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-[#999999] mt-0.5" />
                    </div>
                    <p className="text-[10px] text-[#999999] font-mono mb-2 truncate">
                      {host}
                    </p>
                    <div className="flex items-center justify-between gap-3 text-[11px]">
                      <div className="flex items-center gap-1">
                        <span className="text-[#999999]">Clics:</span>
                        {p.clics > 0 ? (
                          <Badge variant="green">{p.clics}</Badge>
                        ) : (
                          <span className="text-[#999999]">—</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[#999999]">Impr:</span>
                        <span className="text-[#333333] font-medium">
                          {p.impresiones}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[#999999]">CTR:</span>
                        <span className="text-[#333333] font-medium">
                          {(p.ctr * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[#999999]">Pos:</span>
                        <span className="text-[#333333] font-medium">
                          #{p.posicion?.toFixed(1) || "—"}
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
