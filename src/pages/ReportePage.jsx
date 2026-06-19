import { useParams } from "react-router-dom";
import { useReporte } from "../hooks/useReporte";
import { Layout } from "../components/layout/Layout";
import { Topbar } from "../components/layout/Topbar";
import { MesSelector } from "../components/reporte/MesSelector";
import { MetricCard } from "../components/reporte/MetricCard";
import { TendenciaChart } from "../components/reporte/TendenciaChart";
import { DispositivosChart } from "../components/reporte/DispositivosChart";
import { PaisesChart } from "../components/reporte/PaisesChart";
import { ConsultasTabla } from "../components/reporte/ConsultasTabla";
import { PaginasTabla } from "../components/reporte/PaginasTabla";
import { Insights } from "../components/reporte/Insights";
import { Ga4MetricasCards } from "../components/reporte/Ga4MetricasCards";
import { Ga4TendenciaChart } from "../components/reporte/Ga4TendenciaChart";
import { Ga4CanalesChart } from "../components/reporte/Ga4CanalesChart";
import { Ga4PaginasTabla } from "../components/reporte/Ga4PaginasTabla";
import { Ga4PaisesChart } from "../components/reporte/Ga4PaisesChart";
import { Ga4DispositivosChart } from "../components/reporte/Ga4DispositivosChart";
import { Skeleton } from "../components/ui/Skeleton";
import {
  MousePointerClick,
  Eye,
  Percent,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Search,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function ReportePage() {
  const { slug, anio: anioParam, mes: mesParam } = useParams();
  const hoy = new Date();
  const anio = parseInt(anioParam) || hoy.getFullYear();
  const mes = parseInt(mesParam) || hoy.getMonth() + 1;

  const { data, loading, error, refreshing, refresh } = useReporte({
    slug,
    anio,
    mes,
  });

  const cliente = data?.cliente;
  const datos = data?.datos;
  const reporte = data?.reporte;

  const tieneGa4 = cliente?.tiene_ga4 && datos?.ga4?.resumen;
  const tieneSearchConsole = cliente?.tiene_search_console && datos?.resumen;

  const lastUpdate = reporte?.cached_at
    ? formatDistanceToNow(new Date(reporte.cached_at), {
        addSuffix: true,
        locale: es,
      })
    : null;

  return (
    <Layout>
      {({ openSidebar }) => (
        <>
          <Topbar
            slugActual={slug}
            onRefresh={refresh}
            refreshing={refreshing}
            lastUpdate={lastUpdate}
            onMenuClick={openSidebar}
          />

          <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto overflow-x-hidden">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-black">
                  Reporte SEO
                </h2>
                <p className="text-sm text-[#626264] mt-0.5">
                  {tieneGa4 &&
                    tieneSearchConsole &&
                    "Datos combinados de Search Console + Google Analytics"}
                  {tieneGa4 &&
                    !tieneSearchConsole &&
                    "Datos de Google Analytics 4"}
                  {!tieneGa4 &&
                    tieneSearchConsole &&
                    "Datos de Google Search Console"}
                  {!tieneGa4 &&
                    !tieneSearchConsole &&
                    "Sin fuentes de datos configuradas"}
                </p>
              </div>
              <MesSelector slug={slug} anio={anio} mes={mes} />
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FDEBEB] border border-[#F5BFBF]">
                <AlertCircle className="h-5 w-5 text-[#B91C1C] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#7F1D1D]">
                    Error al cargar los datos
                  </p>
                  <p className="text-xs text-[#B91C1C] mt-1 font-mono">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {loading && !data && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 rounded-2xl" />
                  ))}
                </div>
                <Skeleton className="h-80 rounded-2xl" />
                <div className="grid lg:grid-cols-2 gap-4">
                  <Skeleton className="h-64 rounded-2xl" />
                  <Skeleton className="h-64 rounded-2xl" />
                </div>
              </div>
            )}

            {tieneGa4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#E6F5EC] flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-[#115A36]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black">
                      Google Analytics
                    </h3>
                    <p className="text-xs text-[#626264]">
                      Comportamiento de visitantes en el sitio
                    </p>
                  </div>
                </div>

                <Ga4MetricasCards resumen={datos.ga4.resumen} />
                <Ga4TendenciaChart diario={datos.ga4.diario} />

                <div className="grid lg:grid-cols-2 gap-6">
                  <Ga4CanalesChart canales={datos.ga4.canales} />
                  <Ga4PaginasTabla paginas={datos.ga4.paginas} />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <Ga4PaisesChart paises={datos.ga4.paises} />
                  <Ga4DispositivosChart dispositivos={datos.ga4.dispositivos} />
                </div>
              </div>
            )}

            {tieneSearchConsole && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pt-4 border-t border-[#F1F1F4]">
                  <div className="h-9 w-9 rounded-xl bg-[#E6E8F8] flex items-center justify-center">
                    <Search className="h-4 w-4 text-[#0017C1]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black">
                      Search Console
                    </h3>
                    <p className="text-xs text-[#626264]">
                      Cómo te encuentran en Google
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    label="Clics totales"
                    value={datos.resumen?.clics ?? 0}
                    icon={MousePointerClick}
                    color="green"
                    sub="Visitas desde Google"
                    highlight
                  />
                  <MetricCard
                    label="Impresiones"
                    value={datos.resumen?.impresiones ?? 0}
                    icon={Eye}
                    color="cyan"
                    sub="Veces que apareciste"
                  />
                  <MetricCard
                    label="CTR promedio"
                    value={`${((datos.resumen?.ctr ?? 0) * 100).toFixed(1)}%`}
                    icon={Percent}
                    color="blue"
                    sub="De impresiones a clics"
                  />
                  <MetricCard
                    label="Posición media"
                    value={(datos.resumen?.posicion_media ?? 0).toFixed(1)}
                    icon={TrendingUp}
                    color="gray"
                    sub="Promedio en Google"
                  />
                </div>

                <Insights datos={datos} />
                <TendenciaChart diario={datos.diario} />

                <div className="grid lg:grid-cols-2 gap-6">
                  <DispositivosChart dispositivos={datos.dispositivos} />
                  <PaisesChart paises={datos.paises} />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <ConsultasTabla consultas={datos.consultas} />
                  <PaginasTabla paginas={datos.paginas} />
                </div>
              </div>
            )}

            {datos && !tieneGa4 && !tieneSearchConsole && (
              <div className="rounded-2xl border border-[#F1F1F4] bg-white p-12 text-center">
                <p className="text-sm font-medium text-black mb-1">
                  Sin fuentes de datos configuradas
                </p>
                <p className="text-xs text-[#626264]">
                  Configurá GA4 y/o Search Console en el panel admin para ver
                  datos aquí
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
