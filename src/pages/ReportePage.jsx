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
import { Skeleton } from "../components/ui/Skeleton";
import {
  MousePointerClick,
  Eye,
  Percent,
  TrendingUp,
  AlertCircle,
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

  const lastUpdate = reporte?.cached_at
    ? formatDistanceToNow(new Date(reporte.cached_at), {
        addSuffix: true,
        locale: es,
      })
    : null;

  return (
    <Layout>
      <Topbar
        cliente={cliente}
        onRefresh={refresh}
        refreshing={refreshing}
        lastUpdate={lastUpdate}
      />

      <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Selector + título */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">
              Reporte SEO
            </h2>
            <p className="text-sm text-[#626264] mt-0.5">
              Datos combinados de Search Console + Google Analytics
            </p>
          </div>
          <MesSelector slug={slug} anio={anio} mes={mes} />
        </div>

        {/* Estado de error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FDEBEB] border border-[#F5BFBF]">
            <AlertCircle className="h-5 w-5 text-[#B91C1C] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#7F1D1D]">
                Error al cargar los datos
              </p>
              <p className="text-xs text-[#B91C1C] mt-1 font-mono">{error}</p>
            </div>
          </div>
        )}

        {/* Skeleton mientras carga */}
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

        {/* Datos cargados */}
        {datos && (
          <>
            {/* Métricas */}
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

            {/* Insights */}
            <Insights datos={datos} />

            {/* Gráfico tendencia */}
            <TendenciaChart diario={datos.diario} />

            {/* Dispositivos + países */}
            <div className="grid lg:grid-cols-2 gap-6">
              <DispositivosChart dispositivos={datos.dispositivos} />
              <PaisesChart paises={datos.paises} />
            </div>

            {/* Tablas */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ConsultasTabla consultas={datos.consultas} />
              <PaginasTabla paginas={datos.paginas} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
