import { useParams } from "react-router-dom";

export default function ReportePage() {
  const { slug, anio, mes } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Reporte: {slug}</h1>
      <p className="text-gray-500">
        {anio && mes ? `${anio} / ${mes}` : "Mes actual"}
      </p>
    </div>
  );
}
