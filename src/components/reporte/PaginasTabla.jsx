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
          <table className="w-full">
            <thead className="sticky top-0 bg-[#F8F8FB] border-y border-[#F1F1F4]">
              <tr>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-6 py-2.5">
                  URL
                </th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-3 py-2.5 w-20">
                  Clics
                </th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-3 py-2.5 w-24">
                  Impr.
                </th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-3 py-2.5 w-20">
                  CTR
                </th>
                <th className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#626264] px-6 py-2.5 w-20">
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
                      <td className="px-6 py-3">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-1.5 text-sm text-black hover:text-[#0017C1] transition-colors"
                        >
                          <span className="font-medium">{path}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                        </a>
                        <p className="text-[10px] text-[#999999] font-mono mt-0.5">
                          {host}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-right">
                        {p.clics > 0 ? (
                          <Badge variant="green">{p.clics}</Badge>
                        ) : (
                          <span className="text-[#999999] text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right text-sm text-[#626264]">
                        {p.impresiones}
                      </td>
                      <td className="px-3 py-3 text-right text-sm text-[#626264]">
                        {(p.ctr * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-3 text-right text-sm text-[#626264]">
                        #{p.posicion?.toFixed(1) || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
