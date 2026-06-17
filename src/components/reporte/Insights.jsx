import { Lightbulb, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";

export function Insights({ datos }) {
  const insights = generarInsights(datos);
  if (insights.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#F1F1F4] bg-gradient-to-br from-[#E6F5EC] to-[#F8F8FB] p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-[#115A36] flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-black">
          Observaciones clave
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {insights.map((ins, i) => {
          const Icon =
            ins.tipo === "good"
              ? TrendingUp
              : ins.tipo === "warn"
                ? AlertTriangle
                : Lightbulb;
          const colors = {
            good: "text-[#115A36] bg-[#E6F5EC]",
            warn: "text-[#006F83] bg-[#E5F7FA]",
            info: "text-[#0017C1] bg-[#E6E8F8]",
          };
          return (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-xl bg-white/80 backdrop-blur"
            >
              <div
                className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${colors[ins.tipo]}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm text-[#333333] leading-relaxed">
                {ins.texto}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function generarInsights(datos) {
  const insights = [];
  if (!datos) return insights;
  const { resumen, consultas, paises, dispositivos } = datos;

  if (resumen?.clics > 0) {
    insights.push({
      tipo: "good",
      texto: (
        <>
          El sitio recibió <b>{resumen.clics} clics</b> desde Google con{" "}
          <b>{resumen.impresiones} impresiones</b>.
        </>
      ),
    });
  }
  if (resumen?.posicion_media > 0 && resumen.posicion_media < 5) {
    insights.push({
      tipo: "good",
      texto: (
        <>
          Posición media de <b>{resumen.posicion_media.toFixed(1)}</b> — muy
          buena visibilidad en Google.
        </>
      ),
    });
  } else if (resumen?.posicion_media > 10) {
    insights.push({
      tipo: "warn",
      texto: (
        <>
          Posición media de <b>{resumen.posicion_media.toFixed(1)}</b> — hay
          oportunidad de mejorar el SEO.
        </>
      ),
    });
  }
  const mobile = dispositivos?.find(
    (d) => d.cat_dispositivos?.nombre === "MOBILE",
  );
  const totalDev = dispositivos?.reduce((s, d) => s + d.clics, 0) || 0;
  if (mobile && totalDev > 0) {
    const pct = Math.round((mobile.clics / totalDev) * 100);
    if (pct >= 60)
      insights.push({
        tipo: "info",
        texto: (
          <>
            El <b>{pct}% del tráfico</b> proviene de celulares — priorizá la
            experiencia móvil.
          </>
        ),
      });
  }
  const topPais = paises?.[0];
  if (topPais && topPais.clics > 0) {
    insights.push({
      tipo: "info",
      texto: (
        <>
          <b>{topPais.cat_paises?.nombre}</b> lidera con{" "}
          <b>{topPais.clics} clics</b>, seguido por otros países
          internacionales.
        </>
      ),
    });
  }
  const oportunidad = consultas?.find(
    (c) => c.impresiones >= 5 && c.clics === 0,
  );
  if (oportunidad) {
    insights.push({
      tipo: "warn",
      texto: (
        <>
          La consulta <b>"{oportunidad.consulta}"</b> tiene{" "}
          {oportunidad.impresiones} impresiones pero 0 clics — mejorá el título
          de la página.
        </>
      ),
    });
  }
  return insights.slice(0, 6);
}
