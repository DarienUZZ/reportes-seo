import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function MesSelector({ slug, anio, mes }) {
  const navigate = useNavigate();
  const hoy = new Date();
  const esHoyMes = anio === hoy.getFullYear() && mes === hoy.getMonth() + 1;

  function goTo(newAnio, newMes) {
    navigate(`/cliente/${slug}/${newAnio}/${newMes}`);
  }

  function prev() {
    if (mes === 1) goTo(anio - 1, 12);
    else goTo(anio, mes - 1);
  }

  function next() {
    if (esHoyMes) return;
    if (mes === 12) goTo(anio + 1, 1);
    else goTo(anio, mes + 1);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={prev}
        className="p-2 rounded-lg hover:bg-[#F1F1F4] text-[#626264] transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F1F1F4]">
        <Calendar className="h-4 w-4 text-[#626264]" />
        <span className="text-sm font-semibold text-black">
          {meses[mes - 1]} {anio}
        </span>
        {esHoyMes && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#115A36]">
            En vivo
          </span>
        )}
      </div>

      <button
        onClick={next}
        disabled={esHoyMes}
        className={clsx(
          "p-2 rounded-lg text-[#626264] transition",
          esHoyMes ? "opacity-30 cursor-not-allowed" : "hover:bg-[#F1F1F4]",
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
